function modeRule(mode) {
  switch (mode) {
    case "thirsty":
      return `
- Prefer drinks first (type === "drink")
- Suggest at least 2 drinks
- Reasons should mention cold/refreshing/first sip
- Avoid foods unless necessary`;
    case "hungry":
      return `
- Prefer foods first (type === "food")
- Suggest at least 2 foods
- Reasons should mention satisfying/full
- Avoid drinks unless it complements foods`;
    case "drink_all_night":
      return `
- Build a "drinking set": drinks + snacks combo
- Suggest 2 drinks + 1 food
- Reasons should mention pace/variety
- Pick different drink styles (e.g., beer + sour)`;
    default:
      return "";
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { items, cart, mode, userText } = req.body ?? {};

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "items must be an array" });
    }

    const system = `You are a helpful assistant for a mobile ordering app.

Return ONLY valid JSON with this schema:
{
  "summary": "string",
  "suggestions": [
    {"id":"string","reason":"string"}
  ]
}

Rules:
- summary must be 2 short Japanese sentences
- suggestions length must be 3
- id must exist in provided items
- reason must be short (<= 25 Japanese characters)

IMPORTANT BEHAVIOR RULES:
- You MUST choose items ONLY from the provided items array.
- Do NOT invent characteristics (e.g., spicy, sweet, low-carb) unless clearly supported by name or desc.
- If the user's request cannot be satisfied from provided items,
  you MUST say so honestly in summary.
- In that case, suggest the closest alternatives instead.
- Never fabricate non-existing menu traits.

Mode meaning:
- thirsty: focus on refreshing drinks
- hungry: focus on filling foods
- drink_all_night: focus on alcohol + snacks

You MUST strongly reflect the mode when choosing items.
- You MUST consider the user's request when selecting items.

${modeRule(mode)}
`;

    const user = { items, cart, mode, userRequest: userText };

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          { role: "system", content: system },
          { role: "user", content: JSON.stringify(user) },
        ],
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);

    const text =
      data.output?.[0]?.content
        ?.filter((c) => c.type === "output_text")
        ?.map((c) => c.text)
        ?.join("") ?? "";

    if (!text) return res.status(500).json({ error: "No output text" });

    // ★ 500再発防止：JSON.parse を安全に
    try {
      return res.status(200).json(JSON.parse(text));
    } catch {
      console.log("AI RAW TEXT:", text);
      return res
        .status(500)
        .json({ error: "Invalid JSON from model", raw: text });
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server error" });
  }
}
