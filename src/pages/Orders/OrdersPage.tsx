import { Link } from "react-router-dom";

export default function OrdersPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>注文履歴</h1>
      <p>過去の注文一覧</p>

      <Link to="/menu">もう一度注文する</Link>
    </div>
  );
}
