import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import './style/App.css';
import ProductDetails from './admin/ProductDetails';
import Home from './Home';

import Admin from './admin/Admin';
import UserPage from './UserPage';
import ShopCategory from './shop/ShopCategory';
import ShopAccessory from './shop/ShopAccessory';
import Cart from './cart/Cart';
import { CartProvider } from './cart/CartContext';
import Dashboard from './admin/Dashboard';
import Navbar from './Navbar';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Navbar />
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
