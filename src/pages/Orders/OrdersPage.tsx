import Footer from "../../components/footer/Footer";
import { items } from "../../data/items";
import { useSessionStorageState } from "../../hooks/useSessionStorageState";
import style from "./orders.module.scss";

type CartState = Record<string, number>;

type Order = {
  id: string;
  createdAt: number;
  items: CartState;
  totalCount: number;
  totalPrice: number;
};

const ORDER_HISTORY_KEY = "mobile-order-history";

export default function OrdersPage() {
  const [orderHistory] = useSessionStorageState<Order[]>(
    ORDER_HISTORY_KEY,
    []
  );

  // 総合計
  const grandTotalPrice = orderHistory.reduce(
    (sum, order) => sum + order.totalPrice,
    0
  );

  const grandTotalCount = orderHistory.reduce(
    (sum, order) => sum + order.totalCount,
    0
  );


  return (
    <>
      <div className={style.orders}>
        <h1>注文履歴</h1>

        {orderHistory.length === 0 && (
          <p>まだ注文はありません。</p>
        )}

        {orderHistory.map(order => (
          <div key={order.id} className={style.orderListWrap}>
            <h3 className={style.timeWrap}>
              <span>注文時間</span>
              <span className={style.time}>
                {new Date(order.createdAt).toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </h3>
            <ul className={style.orderList}>
              {Object.entries(order.items).map(([id, count]) => {
                const item = items.find(i => i.id === id);
                if (!item) return null;
                return (
                  <li key={id}>
                    <span>{item.name} × {count}</span>
                    <span>¥{item.price * count}</span>
                  </li>
                );
              })}
            </ul>

            <p className={style.total}>
              合計 {order.totalCount}点 <span><small className={style.small}>¥</small>{order.totalPrice.toLocaleString()}</span>
            </p>
          </div>
        ))}

        {orderHistory.length > 0 && (
          <div className={style.grandTotal}>
            <p>
              合計{grandTotalCount}点
              <span>
                <small className={style.small}>¥</small>
                {grandTotalPrice.toLocaleString()}
              </span>
            </p>
          </div>
        )}

      </div>
      <Footer
      />
    </>
  );
}
