import { Badge, BottomNavigation, BottomNavigationAction, Fab } from '@mui/material';
import { useState } from 'react'
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import ChatIcon from '@mui/icons-material/Chat';
import style from "./footer.module.scss"
import { Link } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';
import { motion } from 'motion/react';
import { useCart } from '../../contexts/CartContext';

type Props = {
  onCartOpen: () => void;
  onCheckDrawerOpen: () => void;
  cartCount: number;
};

const Footer = ({ onCartOpen, onCheckDrawerOpen, cartCount }: Props) => {

  const [value, setValue] = useState(0);

  return (
    <div className={style.footerWrap}>
      <motion.div
        className={style.fabWrap}
        animate={{
          y: cartCount > 0 ? -80 : 0 // ← ドロワー高さに合わせる
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <Fab variant="extended" size="medium" className={style.fab}
          component={Link}
          to="/chat">
          <ChatIcon sx={{ mr: 1 }} />
          AIチャット
        </Fab>
      </motion.div>

      <div className={style.footer}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="メニュー" icon={<MenuBookIcon />}
            component={Link}
            to="/menu" />
          <BottomNavigationAction label="カート" icon={<Badge badgeContent={cartCount} color="secondary" invisible={cartCount === 0}><ShoppingCartIcon /></Badge>} onClick={onCartOpen} />

          <BottomNavigationAction label="注文履歴" icon={<HistoryIcon />} component={Link}
            to="/orders" />
          <BottomNavigationAction label="会計" icon={<CheckIcon />}
            onClick={onCheckDrawerOpen}
          />
        </BottomNavigation>
      </div>
    </div>
  )
}

export default Footer