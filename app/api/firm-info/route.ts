import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function stripHtml(html: string): string {
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ");
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ");
  text = text.replace(/<[^>]*>/g, " ");
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

    // Fetch the website
    let websiteText = "";
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const html = await res.text();
        websiteText = stripHtml(html).slice(0, 4000);
      }
    } catch {
      // Website fetch failed — Claude will use defaults
    }

    const prompt = websiteText
      ? `You are extracting information about an architecture or design firm from their website content.

Website text (may be partial):
"""
${websiteText}
"""

Extract and return ONLY a valid JSON object with this exact shape:
{
  "firmDescription": "2-3 sentence professional description of the firm and their design philosophy. Write in first person plural (We are...). If unclear from the text, write a generic but professional architecture firm description.",
  "teamMembers": [
    {
      "name": "Full Name",
      "title": "Professional Title",
      "credentials": "e.g. M.Arch, AIA or leave empty string",
      "bio": "One sentence professional bio",
      "photo": ""
    }
  ]
}

Rules:
- teamMembers should only include actual named individuals found in the text (max 6)
- If no team members are clearly identified, return an empty array []
- All photo values must be empty strings ""
- Return ONLY the JSON, no explanation, no markdown backticks`
      : `Generate a professional architecture firm description and return ONLY valid JSON:
{
  "firmDescription": "We are a boutique architectural practice dedicated to delivering thoughtful, high-quality design. Every project is led by a principal architect from concept to completion, ensuring a seamless client experience.",
  "teamMembers": []
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-5-5",
      // Sonnet 5.5 always thinks first and that counts toward max_tokens,
      // so keep the budget roomy and effort low for these short replies
      max_tokens: 4000,
      output_config: { effort: "low" },
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content.find((b) => b.type === "text")?.text ?? "{}";

    // Parse JSON safely
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return NextResponse.json({
      firmDescription: parsed.firmDescription || "",
      teamMembers: Array.isArray(parsed.teamMembers) ? parsed.teamMembers : [],
    });
  } catch (error) {
    console.error("firm-info error:", error);
    return NextResponse.json({ error: "Failed to extract firm info" }, { status: 500 });
  }
}
