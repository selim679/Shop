import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword({ onCodeSent }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('http://localhost:5002/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (data.success) {
      setMessage('A code has been sent to your email.');
      if (onCodeSent) onCodeSent(email);
    } else {
      setMessage(data.message || 'Error sending the code');
    }
  };

  return (
    <div className="form-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
      <input className='email-input' type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required />
      <button className='submit-button' type="submit">Send Code</button>
      </form>
      {message && <p>{message}</p>}
      <div style={{textAlign:'center', marginTop:16}}>
      <Link to="/reset-password">
      <button type="button" className="submit-button">Reset Password</button>
      </Link>
      </div>
    </div>
  );
}
