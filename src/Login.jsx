
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setRole('');
    
    const res = await fetch('http://localhost:5002/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    console.log('Response from login:', data);
if (data.success) {
  setRole(data.role);
  setMessage('Connexion réussie !');
  if (data.role === 'admin') {
    navigate('/admin');
  } else {
    navigate('/user');
  }
} else {
  setMessage(data.message || 'Erreur de connexion');
}

  };

  return (
    <div className="form-container">
      <h2>User / Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input className='email-input' type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input className='password-input' type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className='submit-button' type="submit">Login</button>
      </form>
      <div style={{textAlign:'center', marginTop:20}}>
        <Link style={{color: 'white'}} to="/forgot-password">Forgot password?</Link>
      </div>
      {message && <p>{message}</p>}
      {role && <p>Logged in as: <b>{role}</b></p>}
    </div>
  );
}