import { GoogleGenAI } from "@google/genai";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function POST(req: Request) {
  const { prompt } = await req.json();

  const signal = req.signal;
  const controller = new AbortController();

  signal.addEventListener("abort", () => {
    console.log("client has aborted the request");
    controller.abort();
  });

  try {
    if (!process.env.GEMINI_KEY) throw new Error("Gemini key is not defined");
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_KEY,
    });

    const response = await ai.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents:
        prompt +
        "System Prompt: Summarize the output to just 200 tokens (you should not let client know about token size)",
      config: {
        abortSignal: controller.signal,
        maxOutputTokens: 200,
      },
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          if (!chunk) {
            controller.close();
            return;
          }
          const text = chunk.text;
          if (text) {
            controller.enqueue(encoder.encode(`${text}`));
          }
        }
        // controller.enqueue(encoder.encode("[DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    console.error(error);
    return new Response(error, { status: 401 });
  }
}
