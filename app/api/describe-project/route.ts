import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { notes, clientName, address, constructionCost, area } = await req.json();

    if (!notes?.trim()) {
      return NextResponse.json({ error: "Notes required" }, { status: 400 });
    }

    const prompt = `You are an architect writing a concise project description for a formal fee proposal.

Project context:
- Client: ${clientName || "Not specified"}
- Address: ${address || "Not specified"}
- Construction Cost: ${constructionCost ? `CAD $${Number(constructionCost).toLocaleString()}` : "Not specified"}
- Area: ${area ? `${Number(area).toLocaleString()} sq ft` : "Not specified"}

Meeting notes / emails from the client:
"""
${notes.trim()}
"""

Write a 2–3 sentence project description for the proposal cover and scope section. Be specific about the project type, key design goals, and any notable program elements mentioned. Use professional architectural language. Write in third person. Do NOT start with "The client" — start with the project type or a design concept.

Return ONLY the description text, no quotes, no preamble.`;

    const message = await client.messages.create({
      model: "claude-sonnet-5-5",
      max_tokens: 200,
      messages: [{ role: "user", content: prompt }],
    });

    const description =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    return NextResponse.json({ description });
  } catch (error) {
    console.error("describe-project error:", error);
    return NextResponse.json({ error: "Failed to generate description" }, { status: 500 });
  }
}
