import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import { CartProvider } from './contexts/CartContext.tsx';
import { OrderHistoryProvider } from './contexts/OrderHistoryContext.tsx';
import { UIProvider } from './contexts/UIContext.tsx';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <BrowserRouter basename="/mobile-order">
    <UIProvider>
      <CartProvider>
        <OrderHistoryProvider>
          <App />
        </OrderHistoryProvider>
      </CartProvider>
    </UIProvider>
  </BrowserRouter>
  // </StrictMode>,
)
