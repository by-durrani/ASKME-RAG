// import { GoogleGenAI } from "@google/genai";

import { getAstraDB } from "@/database/db";
import OpenAI from "openai";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";

/* eslint-disable @typescript-eslint/no-explicit-any */

const openAI = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const db = getAstraDB();

interface VectorEmbedding {
  text: string;
}

export async function POST(req: Request) {
  const { messages: uiMessages }: { messages: UIMessage[] } = await req.json();

  const messages = convertToModelMessages(uiMessages);
  const lastMessage = messages[messages.length - 1];
  const prompt = lastMessage.content[0] as { type: "text"; text: string };

  const signal = req.signal;
  const controller = new AbortController();

  signal.addEventListener("abort", () => {
    console.log("client has aborted the request");
    controller.abort();
  });

  try {
    const embedding = await openAI.embeddings.create({
      model: "text-embedding-3-small",
      input: prompt.text as string,
      encoding_format: "float",
    });

    const collection = db.collection<VectorEmbedding>(
      process.env.ASTRA_VEC_DB_COLLLECTION!
    );

    const cursor = collection.find(
      {},
      {
        sort: {
          $vector: embedding.data[0].embedding,
        },
        limit: 10,
      }
    );

    const document = await cursor.toArray();

    const docMap = document?.map((doc) => doc.text);

    const context = JSON.stringify(docMap);

    const template: { role: "system" | "user" | "assistant"; content: string } =
      {
        role: "system",
        content: ` You are an AI assistant who knows everything about Formula One. Use the below context to augment what you know about Formula One Racing. The context will provide you with the most recent page data from wikipedia, the official F1 website and others.
        If the context doesn't include the information you need answer based on your existing knowledge and don't mention your source of information or what the context does or doesn't include.
        Format responses using markdown where applicable and don't return images.
        ----------------------
        START CONTEXT
        ${context}
        END CONTEXT 
        ----------------------
        QUESTION: ${prompt}
        ----------------------
      `,
      };

    const result = streamText({
      model: openai("gpt-4o-mini"),
      messages: [template, ...messages],
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
