import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

interface ChatResponse {
  response: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ChatResponse>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ response: "Method Not Allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ response: "No prompt provided" });
  }

  // Concatenate the fixed instruction with the user prompt.
  const concatenatedPrompt = `Give me 9 related music recommendations RIYL ${prompt}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful chatbot." },
        { role: "user", content: concatenatedPrompt },
      ],
    });

    const botMessage = completion.choices[0]?.message?.content;

    if (!botMessage) {
      throw new Error("No response from AI");
    }

    return res.status(200).json({ response: botMessage });
  } catch (error) {
    console.error("Error communicating with AI:", error);

    // Ensure error object is properly checked before accessing properties
    if (typeof error === "object" && error !== null && "response" in error) {
      const errResponse = error as { response?: { status?: number } };
      if (errResponse.response?.status === 429) {
        return res.status(429).json({
          response:
            "You have exceeded your API usage quota. Please check your plan or try again later.",
        });
      }
    }

    return res.status(500).json({ response: "Internal server error" });
  }
}
