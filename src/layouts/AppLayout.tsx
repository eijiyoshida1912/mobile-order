import { Outlet } from "react-router-dom";
import Footer from "../components/footer/Footer";
import { useCart } from "../contexts/CartContext";
import { useOrderHistory } from "../contexts/OrderHistoryContext";
import OrderBar from "../components/orderBar/OrderBar";
import { useRef, useState } from "react";
import CartDrawer from "../components/cartDrawer/CartDrawer";
import OrderCompleteModal from "../components/modal/orderCompleteModal/OrderCompleteModal";
import CheckDrawer from "../components/checkDrawer/CheckDrawer";
import { useUI } from "../contexts/UIContext";

export default function AppLayout() {
  const { cart, cartCount, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrderHistory();
  const { cartOpen, openCart, closeCart } = useUI();

  // 注文完了モーダル ---------
  const [orderCompleteOpen, setOrderCompleteOpen] = useState(false);

  // 念のため二重送信ガード（StrictMode/連打対策）
  const submittingRef = useRef(false);

  const submitCart = () => {
    if (cartCount === 0) return;
    if (submittingRef.current) return;
    submittingRef.current = true;

    addOrder({
      items: cart,
      totalCount: cartCount,
      totalPrice,
    });

    clearCart();
    closeCart();

    // ✅ ここでモーダル開く
    setOrderCompleteOpen(true);

    // ロック解除（1フレーム後でOK）
    setTimeout(() => {
      submittingRef.current = false;
    }, 0);
  };

  // 会計 -----------------
  const [checkDrawerOpen, setCheckDrawerOpen] = useState(false);

  return (
    <>
      <Outlet />

      <OrderBar onOpenCart={openCart} />
      <Footer onCartOpen={openCart} onCheckDrawerOpen={() => setCheckDrawerOpen(true)} cartCount={cartCount} />
      <CartDrawer open={cartOpen} onClose={closeCart} onSubmitOrder={submitCart} />

      {/* 注文完了モーダル（共通） */}
      <OrderCompleteModal open={orderCompleteOpen} onClose={() => setOrderCompleteOpen(false)} />

      {/* 会計 */}
      <CheckDrawer drawerOpen={checkDrawerOpen} drawerOnClose={() => setCheckDrawerOpen(false)} />
    </>
  );
}
