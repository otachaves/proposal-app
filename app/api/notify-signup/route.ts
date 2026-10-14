import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false });

    const timestamp = new Date().toLocaleString("en-CA", {
      timeZone: "America/Vancouver",
      dateStyle: "full",
      timeStyle: "short",
    });

    await resend.emails.send({
      from: "Proposal App <noreply@build.archipelagoaec.com>",
      to: "communitymanager@archipelagoaec.com",
      subject: `New visitor on Proposal App — ${email}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; padding: 32px 24px;">
          <div style="background: #0A1628; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
            <p style="color: #C9A84C; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px;">Proposal App</p>
            <h1 style="color: white; font-size: 22px; font-weight: 700; margin: 0;">New visitor signed in</h1>
          </div>

          <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; space-y-3;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; width: 100px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0A1628; font-size: 14px; font-weight: 600;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Time</td>
                <td style="padding: 10px 0; color: #64748b; font-size: 13px;">${timestamp} (Vancouver)</td>
              </tr>
            </table>
          </div>

          <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 20px;">
            Sent automatically by Proposal App · Archipelago
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Silent fail — never block the auth flow
    console.error("Notify signup error:", error);
    return NextResponse.json({ ok: false });
  }
}
