import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import Login from './Login';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import './App.css';

export default function App() {
  return (
    <Router>
      <nav style={{ marginBottom: 20 }}>
      <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
      <Link to="/create-account">Créer un compte</Link>
      </nav>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
