import { useEffect, useRef, useState } from "react";
import { Box, Button, TextField, Paper } from "@mui/material";
import { useCart } from "../../contexts/CartContext";
import { items } from "../../data/items";
import { useUI } from "../../contexts/UIContext";
type Role = "user" | "assistant";
type Msg = { role: Role; content: string };

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "いらっしゃい！気分を教えて〜🍻" },
  ]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { toast } = useUI();
  const handleAddToCart = (id: string) => {
    inc(id);
    toast("カートに追加しました！");
  };


  // おすすめ出す、カートに入れる
  const { inc, cart } = useCart();

  type Suggestion = { id: string; reason: string };
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  type Intent =
    | { type: "suggest"; mode: "thirsty" | "hungry" | "drink_all_night"; confidence: number; reason: string }
    | { type: "chat"; confidence: number; reason: string };

  const detectIntent = (t: string): Intent => {
    const s = t.toLowerCase();

    // 強トリガー（ほぼ確実におすすめ）
    const strong = /(おすすめ|オススメ|推し|選んで|決めて|何がいい|何飲む|何食べる|迷う|迷ってる|お任せ)/;
    if (strong.test(s)) {
      return { type: "suggest", mode: inferMode(t), confidence: 0.95, reason: "strong trigger" };
    }

    // 欲求・状況（“雰囲気”）
    const hungryWords = /(腹|おなか|空いた|食べたい|飯|つまみ|小腹|がっつり|こってり|辛|肉|揚げ|米|ラーメン|餃子|唐揚)/;
    const thirstyWords = /(喉|のど|乾|飲みたい|酒|ビール|サワー|ハイ|酔|一杯)/;
    const partyWords = /(とことん|朝まで|飲み続け|宴|パーティ|二軒目|無限)/;

    const hungryScore = hungryWords.test(s) ? 1 : 0;
    const thirstyScore = thirstyWords.test(s) ? 1 : 0;
    const partyScore = partyWords.test(s) ? 1 : 0;

    // 「〜したい」系が出たらかなり強い
    const desireBoost = /(したい|欲しい|ほしい|求む|求めてる)/.test(s) ? 0.25 : 0;

    const sum = hungryScore + thirstyScore + partyScore;
    const confidence = Math.min(0.6 + desireBoost + 0.15 * sum, 0.9);

    // しきい値：ここで“勝手におすすめ出す”かを決める
    // 0.75 くらいだと暴発しにくい
    if (sum > 0 && confidence >= 0.75) {
      // modeはスコア優先で決める（inferModeより確実）
      const mode =
        hungryScore >= thirstyScore && hungryScore >= partyScore ? "hungry" :
          thirstyScore >= partyScore ? "thirsty" :
            "drink_all_night";

      return { type: "suggest", mode, confidence, reason: "desire/situation" };
    }

    return { type: "chat", confidence: 0.5, reason: "no strong desire" };
  };



  const inferMode = (t: string): "thirsty" | "hungry" | "drink_all_night" => {
    const s = t.toLowerCase();
    if (/(腹|食|おなか|つまみ|辛|肉|揚げ|米|ラーメン|餃子|唐揚)/.test(s)) return "hungry";
    if (/(飲|酒|ビール|サワー|酔|喉|のど|乾)/.test(s)) return "thirsty";
    return "drink_all_night";
  };


  const send = async () => {
    const t = text.trim();
    if (!t || sending) return;

    setText("");
    setSending(true);

    // 先にユーザー発言を追加
    const userMsg: Msg = { role: "user", content: t };
    const next: Msg[] = [...messages, userMsg];
    setMessages(next);

    // ★おすすめ表示は毎回リセット（前のおすすめが残らないように）
    setSuggestions([]);

    try {
      const intent = detectIntent(t);

      if (intent.type === "suggest") {
        const mode = intent.mode;

        // 先に一言（UX）
        setMessages(prev => [...prev, { role: "assistant", content: "了解！おすすめ考えるね〜🍻" }]);

        const r = await fetch("/api/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, cart, mode, userText: t }),
        });

        if (!r.ok) {
          const err = await r.text();
          setMessages(prev => [...prev, { role: "assistant", content: `エラー：${err}` }]);
          return;
        }

        const data = await r.json();
        setSuggestions(data.suggestions ?? []);

        // チャット本文にも出す
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: data.summary ?? "こんな感じどう？" },
        ]);

        return; // suggestのときはここで終了
      }

      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });



      if (!r.ok) {
        const err = await r.text();
        setMessages(prev => [...prev, { role: "assistant", content: `エラー：${err}` }]);
        return;
      }

      const data = await r.json();
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.text ?? "ごめん、うまく返せなかった！" },
      ]);
    } finally {
      setSending(false);
    }
  };


  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <h1>AIチャット</h1>

      <Paper sx={{ p: 2, height: "60vh", overflowY: "auto" }}>
        {messages.map((m, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              mb: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: "80%",
                p: 1.2,
                borderRadius: 2,
                bgcolor: m.role === "user" ? "primary.main" : "grey.200",
                color: m.role === "user" ? "primary.contrastText" : "text.primary",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content}
            </Box>
          </Box>
        ))}

        {suggestions.length > 0 && (
          <Paper sx={{ p: 2, mt: 2 }}>
            <h3 style={{ marginTop: 0 }}>おすすめ</h3>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {suggestions.map(s => {
                const item = items.find(i => i.id === s.id);
                if (!item) return null;

                return (
                  <li key={s.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{item.name}</div>
                      <div style={{ opacity: 0.8 }}>{s.reason}</div>
                    </div>

                    <Button variant="contained" onClick={() => handleAddToCart(item.id)}>
                      追加
                    </Button>
                  </li>
                );
              })}
            </ul>
          </Paper>
        )}

        <div ref={bottomRef} />
      </Paper>

      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <TextField
          fullWidth
          placeholder="例：喉が渇いた！おすすめある？"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          multiline
          maxRows={4}
        />
        <Button variant="contained" onClick={send} disabled={sending}>
          送信
        </Button>
      </Box>
    </Box>
  );
}

