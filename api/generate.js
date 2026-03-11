export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, max_tokens = 2000 } = req.body;
  const response = await fetch("https://api.minimax.chat/v1/text/chatcompletion_v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.MINIMAX_API_KEY}`,
    },
    body: JSON.stringify({ model: "MiniMax-M2.5", max_tokens, messages }),
  });
  const data = await response.json();
  // Normalise to Anthropic-style shape expected by the frontend
  const text = data.choices?.[0]?.message?.content
    ?? data.reply
    ?? data.content?.[0]?.text
    ?? "";
  res.status(200).json({ content: [{ text }], error: data.error ?? null });
}
