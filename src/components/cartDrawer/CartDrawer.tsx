import { Button } from "@mui/material";
import style from "./cartDrawer.module.scss";
import NumberSpinner from "../numberSpinner/NumberSpinner";
import { items } from "../../data/items";
import { useCart } from "../../contexts/CartContext";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmitOrder: () => void;
};

export default function CartDrawer({ open, onClose, onSubmitOrder }: Props) {
  const { cart, cartCount: totalCount, totalPrice, inc, dec } = useCart();
  const getCount = (id: string) => cart[id] ?? 0;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 背景（押したら閉じる） */}
          <motion.div
            className={style.backdrop}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* 本体 */}
          <motion.div
            className={style.cart}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}

          >
            <h2 className={style.title}>カート</h2>

            {totalCount === 0 && <p className={style.empty}>まだ何も入っていません</p>}

            <ul className={style.cartList}>
              {Object.entries(cart).map(([id, count]) => {
                const item = items.find(i => i.id === id);
                if (!item) return null;

                return (
                  <li key={id} className={style.cartItem}>
                    <div className={style.cartLeft}>
                      <p className={style.cartName}>{item.name}</p>
                      <p className={style.cartSub}>
                        <small className={style.yenMark}>¥</small>
                        {(item.price * count).toLocaleString()}
                      </p>
                    </div>

                    <div className={style.cartRight}>
                      <NumberSpinner
                        value={getCount(item.id)}
                        onInc={() => inc(item.id)}
                        onDec={() => dec(item.id)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            {totalCount !== 0 && (
              <Button variant="contained" className={style.submitButton} onClick={onSubmitOrder}>
                {totalCount}点 ¥{totalPrice.toLocaleString()}を注文する
              </Button>
            )}

            <Button variant="outlined" className={style.backButton} onClick={onClose}>
              戻る
            </Button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
