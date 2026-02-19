import { Routes, Route } from "react-router-dom";

import TopPage from "./pages/top/TopPage";
import MenuPage from "./pages/Menu/MenuPage";
import OrdersPage from "./pages/Orders/OrdersPage";
import ChatPage from "./pages/Chat/ChatPage";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import AppLayout from "./layouts/AppLayout";

/*
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
*/
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7A4E2D", // 深めブラウン（上品）
    },
    secondary: {
      main: "#C67C4E", // テラコッタ系アクセント
    },
    background: {
      default: "#FAF7F2", // 生成りっぽい白
      paper: "#FFFFFF",
    },
    text: {
      primary: "#3E2C23",   // 濃いウォームブラウン
      secondary: "#7A6256", // くすみブラウン
    },
  },
  shape: {
    borderRadius: 12, // ちょい丸く
  },
  typography: {
    fontFamily: `"Noto Sans JP", sans-serif`,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route element={<AppLayout />}>
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Routes>
      </Box>
    </ThemeProvider>
  );
}
