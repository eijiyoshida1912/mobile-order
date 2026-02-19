import { Button, Modal } from "@mui/material"
import { motion } from "motion/react";
import wineImage from "../../../images/wine.png"
import style from "./orderCompleteModal.module.scss"

type Props = {
  open: boolean;
  onClose: () => void;
};

const OrderCompleteModal = ({ open, onClose }: Props) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className={style.orderCompleteModal}>
        <h2>ご注文ありがとうございます！</h2>

        <motion.img
          src={wineImage}
          alt="thank you"
          className={style.orderCompleteImage}
          style={{ display: "block" }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, y: [0, -6, 0] }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            y: { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
          }}
        />

        <p>ご注文到着まで今しばらくお待ちください。</p>

        <Button
          variant="outlined"
          className={style.backButton}
          onClick={onClose}
        >注文に戻る</Button>
      </div>
    </Modal>
  )
}

export default OrderCompleteModal