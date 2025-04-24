import { CrawledPage } from "@nexusx/sdk/types";
import { NexusX } from "@nexusx/sdk";
const API_KEY: string = process.env.NEXUSX_API_KEY ?? "";

const client = new NexusX({
  apiKey: API_KEY,
});

const url = "https://www.docs.nexusx.ai";

async function generateStatics() {
  const pages = await client.crawl(url, {
    maxPages: 100,
    followLinks: true,
    ignoreSitemap: false,
  });

  return pages;
}

export default generateStatics;
