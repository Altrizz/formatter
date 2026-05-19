import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { cvData, instruction } = await req.json();

    const prompt = `
You are an expert technical recruiter and resume writer. 
You are given a CV in a structured JSON format. 
Please modify the JSON to satisfy the following instruction: "${instruction}"

RULES:
- Return ONLY the updated JSON conforming to the exact same schema.
- Retain the style: professional, polished, concise, impact-driven.
- Keep bullets short.
- Do not invent fake metrics.
- Keep the identical structure, just update the text content.

CURRENT CV JSON:
${JSON.stringify(cvData, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
        throw new Error("No text response from Gemini");
    }

    return NextResponse.json(JSON.parse(response.text));
  } catch (error) {
    console.error('Error refining CV:', error);
    return NextResponse.json({ error: 'Failed to refine CV' }, { status: 500 });
  }
}
