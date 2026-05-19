import { GoogleGenAI, Part } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const maxDuration = 60; // Allow more time for generation

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText, fileData, fileMimeType, format, notes, name, title, languages } = body;

    const systemInstruction = `
You are an expert technical recruiter and resume writer. 
Restructure and rewrite the following candidate CV into a structured JSON format suitable for an "Algo" branded template.

GOAL: Professional, polished, concise, impact-driven, clear for recruiters. 
FORMAT REQUESTED: ${format}

RULES:
- Extract the candidate’s information into structured JSON.
- Rewrite the CV in a concise, impact-driven style.
- Do not invent facts, metrics, or experiences.
- Improve wording, grammar, structure, and recruiter readability.
- Keep measurable achievements when available.
- If information is missing, omit it instead of fabricating it.
- Keep bullets short and impact-driven. Avoid long paragraphs.
- Remove unnecessary personal details (like full address, marital status).
- Never include "References available upon request."
- Preserve original job titles and companies.

JSON SCHEMA REQUIREMENT:
You must strictly return a valid JSON object matching this structure:
{
  "name": "Candidate Full Name (use provided '${name}' if valid, else extract)",
  "title": "Target/Professional Title (use provided '${title}' if valid, else extract)",
  "summary": ["Bullet 1 of professional summary", "Bullet 2 of professional summary"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "date": "Month Year - Month Year",
      "bullets": ["Action-oriented impact bullet", "Another bullet"]
    }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "technicalSkills": ["Tech 1", "Tech 2"],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree Name",
      "date": "Year"
    }
  ],
  "certifications": ["Cert 1", "Cert 2"],
  "languages": ["Lang 1", "Lang 2 (or use provided '${languages}' if valid, else extract)"],
  "portfolio": "url if any or empty string"
}

NOTES/INSTRUCTIONS FROM USER:
${notes || 'None'}
`;

    // Try building the parts array
    let requestParts: Part[] = [{ text: systemInstruction }];

    if (fileData && fileMimeType) {
      requestParts.push({
        inlineData: {
          data: fileData,
          mimeType: fileMimeType
        }
      });
    }

    if (rawText) {
      requestParts.push({ text: `RAW CV TEXT:\n${rawText}` });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: requestParts,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
        throw new Error("No text response from Gemini");
    }

    return NextResponse.json(JSON.parse(response.text));
  } catch (error) {
    console.error('Error generating CV:', error);
    return NextResponse.json({ error: 'Failed to generate CV' }, { status: 500 });
  }
}
