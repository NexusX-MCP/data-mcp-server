import { CrawledPage } from "@nexusx/sdk/types";
import fs from "fs";
import { OpenAI } from "openai";

type BasicSummary = {
  pathname: string;
  data: CrawledPage | undefined;
}[];

type Summary = {
  pathname: string;
  summary: string;
  data: CrawledPage | undefined;
};

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const prompt = `You are a helpful assistant that generates brief summaries. The information is about NexusX, a tool for web scraping and automation, and contains information about the documentation of the tool. You should provide the summary so that it describes the topic of the page with respect to nexusx and the content of the page.`;

async function summarizePage(page: CrawledPage) {
  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: page.data.markdown,
      },
    ],
    temperature: 0.7,
    max_tokens: 150,
  });

  return response.choices[0].message.content;
}

export async function summarizePages(pages: CrawledPage[]) {
  const summaries = await Promise.all(
    pages.map(async (page) => {
      const summary = await summarizePage(page);
      return {
        ...page,
        summary,
      };
    })
  );

  return summaries;
}

export const summarize = async (inputPath: string, outputPath: string) => {
  const urlToDataMap: BasicSummary = JSON.parse(
    fs.readFileSync(inputPath, "utf8")
  );
  const summaries: Summary[] = [];
  const batchSize = 5;
  const totalBatches = Math.ceil(urlToDataMap.length / batchSize);

  for (let i = 0; i < urlToDataMap.length; i += batchSize) {
    const currentBatch = Math.floor(i / batchSize) + 1;
    console.log(`Processing batch ${currentBatch}/${totalBatches}...`);

    const batch = urlToDataMap.slice(i, i + batchSize);

    const batchPromises = batch.map(async (item) => {
      if (!item.data?.markdown) {
        return {
          pathname: item.pathname,
          summary: "No summary available",
          data: item.data,
        };
      }

      const completion = await client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: item.data.markdown,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      });

      return {
        pathname: item.pathname,
        data: item.data,
        summary: completion.choices[0]?.message?.content || "",
      };
    });

    const batchResults = await Promise.all(batchPromises);
    summaries.push(...batchResults);
  }

  console.log("Processing complete! Writing results to file...");
  fs.writeFileSync(outputPath, JSON.stringify(summaries, null, 2));
  return summaries;
};
