console.log("🔥 THIS IS MY SERVER INDEX.JS 🔥", __filename);

require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");

const app = express();
console.log("OPENAI_API_KEY exists?", !!process.env.OPENAI_API_KEY);

app.use(cors());
app.use(express.json());

// mode別の味付け
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

app.post("/api/suggest", async (req, res) => {
  try {
    const { items, cart, mode } = req.body;

    console.log("MODE:", mode);

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

Mode meaning:
- thirsty: focus on refreshing drinks
- hungry: focus on filling foods
- drink_all_night: focus on alcohol + snacks

You MUST strongly reflect the mode when choosing items.

${modeRule(mode)}
`;

    const user = { items, cart, mode };

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

    // Responses API はここが本体
    const text =
      data.output?.[0]?.content
        ?.filter((c) => c.type === "output_text")
        ?.map((c) => c.text)
        ?.join("") ?? "";

    if (!text) {
      console.log("RAW RESPONSE:", JSON.stringify(data, null, 2));
      return res.status(500).json({ error: "No output text from model" });
    }

    res.json(JSON.parse(text));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server error" });
  }
});

app.listen(3001, () => {
  console.log("AI proxy running at http://localhost:3001");
});
