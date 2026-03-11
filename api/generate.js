export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, max_tokens = 2000 } = req.body;
  const apiKey = req.headers["x-api-key"] || process.env.MINIMAX_API_KEY;
  const model = req.headers["x-model"] || process.env.MINIMAX_MODEL || "MiniMax-M2.5";
  if (!apiKey) return res.status(200).json({ content: [{ text: "" }], error: { message: "No API key configured. Add your key in Settings (⚙)." } });
  const response = await fetch("https://api.minimax.chat/v1/text/chatcompletion_v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, max_tokens, messages }),
  });
  const data = await response.json();
  const text = data.choices?.[0]?.message?.content ?? data.reply ?? data.content?.[0]?.text ?? "";
  if (!text) {
    return res.status(200).json({ content: [{ text: "" }], error: { message: data.base_resp?.status_msg || JSON.stringify(data) } });
  }
  res.status(200).json({ content: [{ text }], error: null });
}
