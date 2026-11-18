import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secret) return res.status(503).json({ error: "Flutterwave is not configured" });

  const { email, amountNaira, reference, name } = req.body ?? {};
  if (!email || !Number.isFinite(amountNaira) || amountNaira <= 0 || !reference) {
    return res.status(400).json({ error: "Valid email, amountNaira and reference are required" });
  }

  try {
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        tx_ref: reference,
        amount: amountNaira,
        currency: "NGN",
        redirect_url: `${process.env.APP_BASE_URL}/payment-return`,
        customer: { email, name: name || "CompoundHQ customer" },
        customizations: { title: "CompoundHQ", description: "Rental payment" }
      })
    });
    const data = await response.json();
    if (!response.ok || data.status !== "success") return res.status(400).json({ error: data.message || "Could not initialize payment" });
    return res.status(200).json({ checkoutUrl: data.data.link, reference });
  } catch {
    return res.status(500).json({ error: "Payment initialization failed" });
  }
}
