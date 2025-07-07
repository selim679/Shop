import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import './App.css';
import ProductDetails from './ProductDetails';
import Home from './Home';

import Admin from './Admin';
import UserPage from './UserPage';
import ShopCategory from './ShopCategory';
import ShopAccessory from './ShopAccessory';
import Cart from './Cart';
import { CartProvider } from './CartContext';
import Dashboard from './Dashboard';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/shop/:category" element={<ShopCategory />} />
          <Route path="/accessories" element={<ShopAccessory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}
