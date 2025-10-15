import { getAstraDB } from "@/database/db";
import OpenAI from "openai";
// import { GoogleGenAI } from "@google/genai";
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// console.log(process.env.GEMINI_KEY);

// const gemini = new GoogleGenAI({
//   apiKey: process.env.GEMINI_KEY,
// });

const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const urls = [
  "https://en.wikipedia.org/wiki/Formula_One",
  "https://en.wikipedia.org/wiki/History_of_Formula_One",
  "https://en.wikipedia.org/wiki/Portal:Formula_One",
  "https://en.wikipedia.org/wiki/2025_Formula_One_World_Championship",
  "https://en.wikipedia.org/wiki/Formula_One_Group",
  "https://www.formula1.com",
  "https://www.statsf1.com/en/default.aspx",
  "https://www.formula1db.com",
];

const scrapePage = async (url: string) => {
  const loader = new PuppeteerWebBaseLoader(url, {
    launchOptions: {
      headless: true,
    },
    gotoOptions: {
      waitUntil: "domcontentloaded",
    },
    evaluate: async (page, browser) => {
      const result = await page.evaluate(() => document.body.innerHTML);
      await browser.close();
      return result;
    },
  });

  const content = await loader.load();

  return content?.[0].pageContent.replaceAll(/<[^>]*>?/gm, "");
};

// console.log(await scrapePage("https://www.formula1.com"));

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100,
});

const createCollection = async () => {
  const db = getAstraDB();
  const res = await db.createCollection(process.env.ASTRA_VEC_DB_COLLLECTION!, {
    vector: {
      dimension: 1536,
      metric: "dot_product",
    },
  });
  console.log(res);
};

const loadSampleData = async () => {
  const db = getAstraDB();
  const collection = db.collection(process.env.ASTRA_VEC_DB_COLLLECTION!);

  for await (const url of urls) {
    const content = await scrapePage(url);
    const chunks = await splitter.splitText(content);
    for await (const chunk of chunks) {
      const reformText = chunk.replace(/\s+/g, " ").trim();

      console.log(reformText);

      const embedding = await openAI.embeddings.create({
        model: "text-embedding-3-small",
        input: reformText,
        encoding_format: "float",
      });

      const vector = embedding.data?.[0].embedding;

      const res = await collection.insertOne({
        $vector: vector,
        text: chunk,
      });
      console.log(res);
    }
  }
};

createCollection().then(() => loadSampleData());
