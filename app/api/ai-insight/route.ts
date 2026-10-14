import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { projectType, constructionCost, totalFee, feePercentage, additionalServices, city, province } =
      await req.json();

    const location = [city, province].filter(Boolean).join(", ") || "Canada";

    const servicesText =
      additionalServices.length > 0
        ? `Additional services included: ${additionalServices.join(", ")}.`
        : "No additional services selected beyond basic scope.";

    const prompt = `You are a senior architectural practice consultant with deep knowledge of North American fee structures and local market conditions.

Project: ${projectType}
Location: ${location}
Construction cost: CAD $${constructionCost.toLocaleString()}
Proposed fee: CAD $${totalFee.toLocaleString()} (${feePercentage.toFixed(1)}% of construction cost)
${servicesText}

Market benchmark: 8–15% for residential new construction in Canada. Fees in high-cost markets like Greater Vancouver, Victoria, and Toronto typically run 10–14% due to regulatory complexity and land costs.

Please assess this fee proposal in exactly 3 sentences:
1. Whether the fee percentage is competitive, low, or high vs. the local ${location} market and the North American benchmark
2. Whether the profit margin appears at risk given typical overhead and labour costs in ${location}
3. One specific, actionable adjustment suggestion if needed (or confirm it looks strong)

Be direct and professional. Reference the specific market when relevant. Avoid generic advice.`;

    const message = await client.messages.create({
      model: "claude-sonnet-5-5",
      // Sonnet 5.5 always thinks first and that counts toward max_tokens,
      // so keep the budget roomy and effort low for these short replies
      max_tokens: 4000,
      output_config: { effort: "low" },
      messages: [{ role: "user", content: prompt }],
    });

    const insight =
      message.content.find((b) => b.type === "text")?.text ?? "";

    if (!insight) {
      console.error("AI insight error: empty reply, stop_reason =", message.stop_reason);
      return NextResponse.json({ error: "Failed to generate insight" }, { status: 502 });
    }

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("AI insight error:", error);
    return NextResponse.json({ error: "Failed to generate insight" }, { status: 500 });
  }
}
