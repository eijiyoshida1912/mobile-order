import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>404</h1>
      <p>ページが見つかりません</p>

      <Link to="/">トップへ戻る</Link>
    </div>
  );
}
