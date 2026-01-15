import { Link } from "react-router-dom";

export default function TopPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>トップ</h1>
      <p>イベントバナー</p>

      <Link to="/menu">注文を始める</Link>
    </div>
  );
}