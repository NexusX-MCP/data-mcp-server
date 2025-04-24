import { z } from "zod";
import { Ajv } from "ajv";

const schemaValidator = new Ajv({
  coerceTypes: true,
  useDefaults: true,
});

export const browserSessionOptionsSchema = z
  .object({
    useProxy: z
      .boolean()
      .default(false)
      .describe("Whether to use a proxy. Recommended false."),
    useStealth: z
      .boolean()
      .default(false)
      .describe("Whether to use stealth mode. Recommended false."),
    solveCaptchas: z
      .boolean()
      .default(false)
      .describe("Whether to solve captchas. Recommended false."),
    acceptCookies: z
      .boolean()
      .default(false)
      .describe(
        "Whether to automatically close the accept cookies popup. Recommended false."
      ),
    profile: z
      .object({
        id: z
          .string()
          .optional()
          .describe("ID of the persistent profile to use for the session"),
        persistChanges: z
          .boolean()
          .default(true)
          .describe(
            "Whether changes made during the session should be saved to the profile. Recommended true."
          ),
      })
      .optional()
      .describe("Options for using a persistent NexusX profile"),
  })
  .strict() // Ensure no unknown keys are passed
  .optional()
  .describe(
    "Options for the browser session. Avoid setting these if not mentioned explicitly"
  );

// Scrape Webpage

export const scrapeWebpageToolParamSchemaRaw = {
  url: z.string().url().describe("The URL of the webpage to scrape"),
  sessionOptions: browserSessionOptionsSchema,
  outputFormat: z
    .array(z.enum(["markdown", "html", "links", "screenshot"]))
    .min(1)
    .describe("The format of the output"),
};

export const scrapeWebpageToolParamSchema = z.object(
  scrapeWebpageToolParamSchemaRaw
);

export type ScrapeWebpageToolParamSchemaType = z.infer<
  typeof scrapeWebpageToolParamSchema
>;

// Extract Structured Data

export const extractStructuredDataToolParamSchemaRaw = {
  urls: z
    .array(z.string().url())
    .describe(
      "The list of URLs of the webpages to extract structured information from. Can include wildcards (e.g. https://example.com/*)"
    ),
  prompt: z.string().describe("The prompt to use for the extraction"),
  schema: z
    .any({})
    .transform((schema) => {
      if (!schema) {
        return false;
      } else {
        try {
          if (typeof schema === "string") {
            try {
              const parsedSchema = JSON.parse(schema);
              const validate = schemaValidator.compile(parsedSchema);
              if (typeof validate === "function") {
                return parsedSchema;
              } else {
                return undefined;
              }
            } catch (err) {
              return undefined;
            }
          } else {
            const validate = schemaValidator.compile(schema);
            if (typeof validate === "function") {
              return schema;
            } else {
              return undefined;
            }
          }
        } catch (err) {
          return false;
        }
      }
    })
    .describe(
      "The json schema to use for the extraction. Must provide an object describing a spec compliant json schema, any other types are invalid."
    ),
  sessionOptions: browserSessionOptionsSchema,
};

export const extractStructuredDataToolParamSchema = z.object(
  extractStructuredDataToolParamSchemaRaw
);

export type ExtractStructuredDataToolParamSchemaType = z.infer<
  typeof extractStructuredDataToolParamSchema
>;

// Crawl Webpages

export const crawlWebpagesToolParamSchemaRaw = {
  url: z.string().url().describe("The URL of the webpage to crawl."),
  sessionOptions: browserSessionOptionsSchema,
  outputFormat: z
    .array(z.enum(["markdown", "html", "links", "screenshot"]))
    .min(1)
    .describe("The format of the output"),
  followLinks: z
    .boolean()
    .describe("Whether to follow links on the crawled webpages"),
  maxPages: z
    .number()
    .int()
    .positive()
    .finite()
    .safe()
    .min(1)
    .max(100)
    .default(10),
  ignoreSitemap: z.boolean().default(false),
};

export const crawlWebpagesToolParamSchema = z.object(
  crawlWebpagesToolParamSchemaRaw
);

export type CrawlWebpagesToolParamSchemaType = z.infer<
  typeof crawlWebpagesToolParamSchema
>;

// Browser Use

export const browserUseToolParamSchemaRaw = {
  task: z.string().describe("The task to perform inside the browser"),
  sessionOptions: browserSessionOptionsSchema,
  returnStepInfo: z
    .boolean()
    .default(false)
    .describe(
      "Whether to return step-by-step information about the task.Should be false by default. May contain excessive information, so we strongly recommend setting this to false."
    ),
  maxSteps: z
    .number()
    .int()
    .positive()
    .finite()
    .safe()
    .min(1)
    .max(100)
    .default(25),
};

export const browserUseToolParamSchema = z.object(browserUseToolParamSchemaRaw);

export type BrowserUseToolParamSchemaType = z.infer<
  typeof browserUseToolParamSchema
>;

// OAI CUA

export const oaiCuaToolParamSchemaRaw = {
  task: z.string().describe("The task to perform inside the browser"),
  sessionOptions: browserSessionOptionsSchema,
  returnStepInfo: z
    .boolean()
    .default(false)
    .describe(
      "Whether to return step-by-step information about the task.Should be false by default. May contain excessive information, so we strongly recommend setting this to false."
    ),
  maxSteps: z
    .number()
    .int()
    .positive()
    .finite()
    .safe()
    .min(1)
    .max(100)
    .default(25),
};

export const oaiCuaToolParamSchema = z.object(oaiCuaToolParamSchemaRaw);

export type OaiCuaToolParamSchemaType = z.infer<typeof oaiCuaToolParamSchema>;

// Claude Computer Use

export const claudeComputerUseToolParamSchemaRaw = {
  task: z.string().describe("The task to perform inside the browser"),
  sessionOptions: browserSessionOptionsSchema,
  returnStepInfo: z
    .boolean()
    .default(false)
    .describe(
      "Whether to return step-by-step information about the task.Should be false by default. May contain excessive information, so we strongly recommend setting this to false."
    ),
  maxSteps: z
    .number()
    .int()
    .positive()
    .finite()
    .safe()
    .min(1)
    .max(100)
    .default(25),
};

export const claudeComputerUseToolParamSchema = z.object(
  claudeComputerUseToolParamSchemaRaw
);

export type ClaudeComputerUseToolParamSchemaType = z.infer<
  typeof claudeComputerUseToolParamSchema
>;

// Bing search

export const bingSearchToolParamSchemaRaw = {
  query: z.string().describe("The search query to submit to Bing"),
  sessionOptions: browserSessionOptionsSchema,
  numResults: z
    .number()
    .int()
    .positive()
    .finite()
    .safe()
    .min(1)
    .max(10)
    .default(5),
};

export const bingSearchToolParamSchema = z.object(bingSearchToolParamSchemaRaw);

export type BingSearchToolParamSchemaType = z.infer<
  typeof bingSearchToolParamSchema
>;

// Create Profile

export const createProfileToolParamSchemaRaw = {
  name: z.string().describe("The name of the profile to create"),
};

export const createProfileToolParamSchema = z.object(
  createProfileToolParamSchemaRaw
);

export type CreateProfileToolParamSchemaType = z.infer<
  typeof createProfileToolParamSchema
>;

// Delete Profile

export const deleteProfileToolParamSchemaRaw = {
  id: z.string().describe("The ID of the profile to delete"),
};

export const deleteProfileToolParamSchema = z.object(
  deleteProfileToolParamSchemaRaw
);

export type DeleteProfileToolParamSchemaType = z.infer<
  typeof deleteProfileToolParamSchema
>;

// List Profiles

export const listProfilesToolParamSchemaRaw = {};

export const listProfilesToolParamSchema = z.object(
  listProfilesToolParamSchemaRaw
);

export type ListProfilesToolParamSchemaType = z.infer<
  typeof listProfilesToolParamSchema
>;
