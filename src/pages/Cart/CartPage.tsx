import { Link } from "react-router-dom";

export default function CartPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>カート</h1>
      <p>商品・数量・合計金額</p>

      <Link to="/complete">注文する</Link>
    </div>
  );
}
