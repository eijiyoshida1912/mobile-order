export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

  try {
    const { messages } = req.body ?? {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages must be an array" });
    }

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: messages, // [{role, content}, ...]
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);

    const text =
      data.output?.[0]?.content
        ?.filter((c) => c.type === "output_text")
        ?.map((c) => c.text)
        ?.join("") ?? "";

    return res.status(200).json({ text });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server error" });
  }
}
