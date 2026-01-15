import { Link } from "react-router-dom";

export default function CompletePage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>注文完了</h1>
      <p>ありがとうございました！</p>

      <Link to="/orders">注文履歴を見る</Link>
    </div>
  );
}
