import { Button } from "@mui/material";
import { motion, AnimatePresence } from "motion/react";
import style from "./orderBar.module.scss";
import { useCart } from "../../contexts/CartContext";

type Props = {
  onOpenCart: () => void;
};

export default function OrderBar({ onOpenCart }: Props) {
  const { cartCount, totalPrice } = useCart();

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          className={style.wrap}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Button
            variant="contained"
            className={style.button}
            onClick={onOpenCart}
          >
            {cartCount}点 ¥{totalPrice.toLocaleString()} を注文する
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
