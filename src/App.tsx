import { Routes, Route } from "react-router-dom";

import TopPage from "./pages/top/TopPage";
import MenuPage from "./pages/Menu/MenuPage";
import ItemDetailPage from "./pages/ItemDetail/ItemDetailPage";
import CartPage from "./pages/Cart/CartPage";
import OrdersPage from "./pages/Orders/OrdersPage";
import ChatPage from "./pages/Chat/ChatPage";
import CompletePage from "./pages/Complete/CompletePage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TopPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/item/:itemId" element={<ItemDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/complete" element={<CompletePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
