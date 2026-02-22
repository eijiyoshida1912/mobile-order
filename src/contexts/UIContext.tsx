import React, { createContext, useContext, useMemo, useState } from "react";

type UIContextValue = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // 追加：トースト
  toast: (message: string) => void;
  toastOpen: boolean;
  toastMessage: string;
  closeToast: () => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  // 追加：トースト状態
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const toast = (message: string) => {
    setToastMessage(message);

    // 連打でも確実に出す小技（同じメッセージでも再表示される）
    setToastOpen(false);
    requestAnimationFrame(() => setToastOpen(true));
  };

  const closeToast = () => setToastOpen(false);

  const value = useMemo(
    () => ({
      cartOpen,
      openCart,
      closeCart,
      toast,
      toastOpen,
      toastMessage,
      closeToast,
    }),
    [cartOpen, toastOpen, toastMessage]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
