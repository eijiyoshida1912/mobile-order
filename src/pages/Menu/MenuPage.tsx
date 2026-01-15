import { Link } from "react-router-dom";
import { items } from "../../data/items";

export default function MenuPage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>商品一覧</h1>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <Link to={`/item/${item.id}`}>
              {item.name}（¥{item.price}）
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
