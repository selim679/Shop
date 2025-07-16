import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style/index.css';
import App from './App.jsx';
import { CartProvider } from './cart/CartContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>
);
