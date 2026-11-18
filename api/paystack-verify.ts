import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const reference = String(req.query.reference || "");
  if (!secret) return res.status(503).json({ error: "Paystack is not configured" });
  if (!reference) return res.status(400).json({ error: "Payment reference is required" });

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const data = await response.json();
    if (!response.ok || !data.status) return res.status(400).json({ error: data.message || "Verification failed" });
    return res.status(200).json({
      verified: data.data.status === "success",
      status: data.data.status,
      reference: data.data.reference,
      amountNaira: data.data.amount / 100,
      currency: data.data.currency
    });
  } catch {
    return res.status(500).json({ error: "Payment verification failed" });
  }
}
