import { useEffect, useState } from "react";

export function useSessionStorageState<T>(key: string, initialValue: T) {
  const read = () => {
    const raw = sessionStorage.getItem(key);
    if (!raw) return initialValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initialValue;
    }
  };

  const [state, setState] = useState<T>(read);

  const setAndStore = (value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next =
        typeof value === "function" ? (value as (p: T) => T)(prev) : value;
      sessionStorage.setItem(key, JSON.stringify(next));

      // ★同一タブ内の他コンポーネントにも通知
      window.dispatchEvent(
        new CustomEvent("session-storage", { detail: { key } }),
      );

      return next;
    });
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      // storageイベントは同一タブでは基本飛ばないけど一応
      if (e.storageArea !== sessionStorage) return;
      if (e.key !== key) return;
      setState(read());
    };

    const onCustom = (e: Event) => {
      const ce = e as CustomEvent<{ key?: string }>;
      if (ce.detail?.key && ce.detail.key !== key) return;
      setState(read());
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("session-storage", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("session-storage", onCustom);
    };
  }, [key]);

  return [state, setAndStore] as const;
}
