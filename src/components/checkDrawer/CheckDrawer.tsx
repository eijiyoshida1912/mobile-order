import { useState } from "react";
import style from "./checkDrawer.module.scss"
import { useCart } from "../../contexts/CartContext";
import { Button, Modal } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import thankyouImage from "../../images/thankyou.png"
import { useOrderHistory } from "../../contexts/OrderHistoryContext";

type Props = {
  drawerOpen: boolean;
  drawerOnClose: () => void;
};

const CheckDrawer = ({ drawerOpen, drawerOnClose }: Props) => {

  const { clearCart } = useCart();
  const { clearOrders, grandTotalCount, grandTotalPrice } = useOrderHistory();

  const [checkConfirmModalOpen, setCheckConfirmModalOpen] = useState(false);
  const handleCheckConfirmModalOpen = () => {
    drawerOnClose();
    setCheckConfirmModalOpen(true);
  }
  const [finishModalOpen, setFinishModalOpen] = useState(false);
  const handleFinishModalOpen = () => {
    setCheckConfirmModalOpen(false);
    setFinishModalOpen(true);
    clearCart(); // カート消す
    clearOrders();    // 注文履歴消す
  }

  const navigate = useNavigate();
  const linkToOrders = () => {
    drawerOnClose();
    navigate("/orders");

  }
  return (
    <>
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* 背景（押したら閉じる） */}
            <motion.div
              className={style.backdrop}
              onClick={drawerOnClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* 本体 */}
            <motion.div
              className={style.check}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}

            >
              <h2 className={style.title}>お会計</h2>

              {grandTotalCount === 0 ? (
                <p className={style.empty}>まだ何も入っていません</p>
              ) : (
                <>
                  <div className={style.checkDetail}>
                    <p className={style.totalCount}>合計{grandTotalCount}点</p>
                    <p className={style.totalPrice}>¥{grandTotalPrice.toLocaleString()}</p>
                  </div>
                  <div className={style.detailLinkWrap}>
                    <button className={style.detailLink} onClick={() => linkToOrders()}>注文履歴はこちら</button>
                  </div>
                  <Button
                    variant="contained"
                    className={style.submitButton}
                    onClick={() => handleCheckConfirmModalOpen()}
                  >お会計する</Button>
                </>
              )}
              <Button
                variant="outlined"
                className={style.backButton}
                onClick={drawerOnClose}
              >戻る</Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Modal
        open={checkConfirmModalOpen}
        onClose={() => setCheckConfirmModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={style.checkConfirmModal}>
          <h2>お会計を確定してよろしいですか？</h2>
          <p>確定後は追加・変更ができません。</p>
          <Button
            variant="contained"
            className={style.submitButton}
            onClick={() => handleFinishModalOpen()}
          >¥{grandTotalPrice.toLocaleString()} をお会計する</Button>
          <Button
            variant="outlined"
            className={style.backButton}
            onClick={() => setCheckConfirmModalOpen(false)}
          >戻る</Button>
        </div>
      </Modal>

      <Modal
        open={finishModalOpen}
        onClose={() => setFinishModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={style.finishModal}>
          <h2>ありがとうございました！</h2>

          <motion.img
            className={style.image}
            src={thankyouImage}
            alt="thank you"
            style={{ display: "block" }}
            initial={{
              clipPath: "inset(0 100% 0 0)",
              opacity: 0,
              y: 0
            }}
            animate={{
              clipPath: "inset(0 0% 0 0)",
              opacity: 1,
              y: [0, -4, 0]
            }}
            transition={{
              clipPath: {
                duration: 0.9,
                ease: "easeInOut"
              },
              opacity: {
                duration: 0.4
              },
              y: {
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1 // 書き終わってから呼吸開始
              }
            }}
          />
          <p>またのご来店お待ちしております。</p>
        </div>
      </Modal>
    </>
  )
}

export default CheckDrawer