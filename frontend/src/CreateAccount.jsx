import { useState } from 'react';
import './style/App.css';

export default function CreateAccount() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    pays: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('http://localhost:5002/api/createAccount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) setMessage('Account created successfully!');
    else setMessage(data.message || 'Error creating account');
  };

  return (
    <div className="form-container">
      <h2>Create a User Account</h2>
      <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
      <input name="nom" placeholder="Last Name" value={form.nom} onChange={handleChange} required />
      <input name="prenom" placeholder="First Name" value={form.prenom} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
      <input name="telephone" placeholder="Phone Number" value={form.telephone} onChange={handleChange} required />
      <input name="pays" placeholder="Country" value={form.pays} onChange={handleChange} required />
      <button style={{marginTop: '1px'}} type="submit">Create Account</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
