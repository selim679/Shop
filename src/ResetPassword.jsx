import { useState } from 'react';

export default function ResetPassword({ emailFromLink }) {
  const [email, setEmail] = useState(emailFromLink || '');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    const res = await fetch('http://localhost:5002/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword })
    });
    const data = await res.json();
    if (data.success) {
      setMessage('Password reset successfully!');
      setIsError(false);
    } else {
      setMessage(data.message || 'Error resetting password');
      setIsError(true);
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
      <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Code received by email" value={code} onChange={e => setCode(e.target.value)} required />
      <input type="password" placeholder="New password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
      <button type="submit">Reset</button>
      </form>
      {message && <p style={{ color: isError ? '#dc2626' : '#16a34a', textAlign: 'center' }}>{message}</p>}
    </div>
  );
}
