export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, max_tokens = 2000 } = req.body;
  const apiKey = req.headers["x-api-key"] || process.env.ANTHROPIC_API_KEY;
  const provider = req.headers["x-provider"] || "anthropic";
  const groupId = req.headers["x-group-id"] || process.env.MINIMAX_GROUP_ID || "";

  if (!apiKey) {
    return res.status(200).json({ content: [{ text: "" }], error: { message: "No API key configured. Add your key in Settings (⚙)." } });
  }

  let endpoint, headers, body, extractText;

  if (provider === "minimax") {
    const model = req.headers["x-model"] || "MiniMax-M2.5";
    endpoint = "https://api.minimax.chat/v1/chat/completions";
    if (groupId) endpoint += `?GroupId=${groupId}`;
    headers = { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` };
    body = JSON.stringify({ model, max_tokens, messages });
    extractText = data => data.choices?.[0]?.message?.content ?? data.reply ?? "";
  } else {
    const model = req.headers["x-model"] || "claude-sonnet-4-20250514";
    endpoint = "https://api.anthropic.com/v1/messages";
    headers = { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" };
    body = JSON.stringify({ model, max_tokens, messages });
    extractText = data => data.content?.map(b => b.text || "").join("") || "";
  }

  let response;
  try {
    response = await fetch(endpoint, { method: "POST", headers, body });
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

  const text = extractText(data);
  if (!text) {
    const errMsg = data.error?.message || data.base_resp?.status_msg || JSON.stringify(data);
    return res.status(200).json({ content: [{ text: "" }], error: { message: errMsg } });
  }
  res.status(200).json({ content: [{ text }], error: null });
}
