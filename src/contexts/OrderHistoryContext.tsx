import React, { createContext, useContext, useMemo } from "react";
import { useSessionStorageState } from "../hooks/useSessionStorageState";

type CartState = Record<string, number>;

export type Order = {
  id: string;
  createdAt: number;
  items: CartState;
  totalCount: number;
  totalPrice: number;
};

const ORDER_HISTORY_KEY = "mobile-order-history";

type OrderHistoryContextValue = {
  orderHistory: Order[];
  addOrder: (order: Omit<Order, "id" | "createdAt"> & Partial<Pick<Order, "id" | "createdAt">>) => void;
  clearOrders: () => void;
  grandTotalCount: number;
  grandTotalPrice: number;
};

const OrderHistoryContext = createContext<OrderHistoryContextValue | null>(null);

export function OrderHistoryProvider({ children }: { children: React.ReactNode }) {
  const [orderHistory, setOrderHistory] = useSessionStorageState<Order[]>(ORDER_HISTORY_KEY, []);

  const addOrder: OrderHistoryContextValue["addOrder"] = (order) => {
    const newOrder: Order = {
      id: order.id ?? (crypto.randomUUID?.() ?? String(Date.now())),
      createdAt: order.createdAt ?? Date.now(),
      items: order.items,
      totalCount: order.totalCount,
      totalPrice: order.totalPrice,
    };
    setOrderHistory((prev) => [newOrder, ...prev]);
  };

  const clearOrders = () => setOrderHistory([]);

  const grandTotalCount = useMemo(
    () => orderHistory.reduce((sum, o) => sum + o.totalCount, 0),
    [orderHistory]
  );
  const grandTotalPrice = useMemo(
    () => orderHistory.reduce((sum, o) => sum + o.totalPrice, 0),
    [orderHistory]
  );

  const value: OrderHistoryContextValue = {
    orderHistory,
    addOrder,
    clearOrders,
    grandTotalCount,
    grandTotalPrice,
  };

  return <OrderHistoryContext.Provider value={value}>{children}</OrderHistoryContext.Provider>;
}

export function useOrderHistory() {
  const ctx = useContext(OrderHistoryContext);
  if (!ctx) throw new Error("useOrderHistory must be used within OrderHistoryProvider");
  return ctx;
}
