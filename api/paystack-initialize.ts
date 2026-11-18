import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return res.status(503).json({ error: "Paystack is not configured" });

  const { email, amountNaira, reference, callbackUrl } = req.body ?? {};
  if (!email || !Number.isFinite(amountNaira) || amountNaira <= 0 || !reference) {
    return res.status(400).json({ error: "Valid email, amountNaira and reference are required" });
  }

  try {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: Math.round(amountNaira * 100),
        reference,
        callback_url: callbackUrl || `${process.env.APP_BASE_URL}/payment-return`
      })
    });
    const data = await response.json();
    if (!response.ok || !data.status) return res.status(400).json({ error: data.message || "Could not initialize payment" });
    return res.status(200).json({ authorizationUrl: data.data.authorization_url, reference: data.data.reference });
  } catch {
    return res.status(500).json({ error: "Payment initialization failed" });
  }
}
