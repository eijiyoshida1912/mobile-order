import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { items } from "../data/items";

export type CartState = Record<string, number>;
const CART_KEY = "mobile-order-cart";

type CartContextValue = {
  cart: CartState;
  cartCount: number;
  totalPrice: number;
  inc: (id: string) => void;
  dec: (id: string) => void;
  setCount: (id: string, count: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readCart(): CartState {
  const raw = sessionStorage.getItem(CART_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object") return parsed;
    return {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // 初回だけ sessionStorage から読む
  const [cart, setCart] = useState<CartState>(() => readCart());

  // 変更があれば保存（StrictModeでもOK）
  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const inc = (id: string) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] ?? 0) + 1,
    }));
  };

  const dec = (id: string) => {
    setCart(prev => {
      const next = (prev[id] ?? 0) - 1;
      if (next <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const setCount = (id: string, count: number) => {
    setCart(prev => {
      if (count <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: count };
    });
  };

  const clearCart = () => setCart({});

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, v) => sum + v, 0),
    [cart]
  );

  const totalPrice = useMemo(() => {
    return Object.entries(cart).reduce((sum, [id, count]) => {
      const item = items.find(i => i.id === id);
      if (!item) return sum;
      return sum + item.price * count;
    }, 0);
  }, [cart]);

  const value: CartContextValue = useMemo(
    () => ({ cart, cartCount, totalPrice, inc, dec, setCount, clearCart }),
    [cart, cartCount, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
