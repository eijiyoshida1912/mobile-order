export type SuggestMode = "thirsty" | "hungry" | "drink_all_night";
export type Suggestion = { id: string; reason: string };
export type SuggestResponse = { summary: string; suggestions: Suggestion[] };

export async function fetchSuggestions(
  items: any[],
  cart: Record<string, number>,
  mode: SuggestMode,
): Promise<SuggestResponse> {
  const res = await fetch("/api/suggest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode,
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        type: i.type,
        price: i.price,
        desc: i.desc,
      })),
      cart,
    }),
  });

  if (!res.ok) throw new Error("AI request failed");
  return res.json();
}
