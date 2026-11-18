import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const secret = process.env.FLUTTERWAVE_SECRET_KEY;
  const transactionId = String(req.query.transaction_id || "");
  if (!secret) return res.status(503).json({ error: "Flutterwave is not configured" });
  if (!transactionId) return res.status(400).json({ error: "transaction_id is required" });

  try {
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${encodeURIComponent(transactionId)}/verify`, {
      headers: { Authorization: `Bearer ${secret}` }
    });
    const data = await response.json();
    if (!response.ok || data.status !== "success") return res.status(400).json({ error: data.message || "Verification failed" });
    return res.status(200).json({
      verified: data.data.status === "successful" && data.data.currency === "NGN",
      status: data.data.status,
      reference: data.data.tx_ref,
      amountNaira: data.data.amount,
      currency: data.data.currency
    });
  } catch {
    return res.status(500).json({ error: "Payment verification failed" });
  }
}
