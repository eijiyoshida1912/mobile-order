import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { items } from "../../data/items";


export default function ItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const item = items.find((i) => i.id === itemId);

  const [qty, setQty] = useState(1);

  if (!item) {
    return (
      <div style={{ padding: 16 }}>
        <h1>商品が見つかりません</h1>
        <Link to="/menu">商品一覧へ</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>{item.name}</h1>
      <p>¥{item.price}</p>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
        <span>{qty}</span>
        <button onClick={() => setQty((q) => q + 1)}>＋</button>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/cart">カートに入れる（仮）</Link>
      </div>
    </div>
  );
}
