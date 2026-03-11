export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, max_tokens = 2000 } = req.body;
  const apiKey = req.headers["x-api-key"] || process.env.MINIMAX_API_KEY;
  const model = req.headers["x-model"] || process.env.MINIMAX_MODEL || "MiniMax-M2.5";
  let endpoint = req.headers["x-endpoint"] || process.env.MINIMAX_ENDPOINT || "https://api.minimaxi.com/v1/chat/completions";
  if (endpoint && !endpoint.startsWith("http")) endpoint = "https://" + endpoint;

  if (!apiKey) {
    return res.status(200).json({ content: [{ text: "" }], error: { message: "No API key configured. Add your key in Settings (⚙)." } });
  }

  let response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, max_tokens, messages }),
    });
  } catch (e) {
    return res.status(200).json({ content: [{ text: "" }], error: { message: `Network error: ${e.message}` } });
  }

  const raw = await response.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return res.status(200).json({ content: [{ text: "" }], error: { message: `API returned non-JSON (HTTP ${response.status}): ${raw.slice(0, 200)}` } });
  }

  const text = data.choices?.[0]?.message?.content ?? data.reply ?? data.content?.[0]?.text ?? "";
  if (!text) {
    return res.status(200).json({ content: [{ text: "" }], error: { message: data.base_resp?.status_msg || JSON.stringify(data) } });
  }
  res.status(200).json({ content: [{ text }], error: null });
}
