import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
   
    fetch('http://localhost:5002/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <nav>
          <button className="active" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/admin')}>Produits</button>
          <button onClick={() => {
            localStorage.removeItem('admin_token');
            navigate('/login');
          }}>Déconnexion</button>
        </nav>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <h1>Dashboard</h1>
        </header>
        <section className="dashboard-stats">
          <div className="stat-card">
            <h2>Chiffre d'affaires</h2>
            <p>${stats?.revenue ?? '...'}</p>
          </div>
          <div className="stat-card">
            <h2>Commandes</h2>
            <p>{stats?.orders ?? '...'}</p>
          </div>
          <div className="stat-card">
            <h2>Produits</h2>
            <p>{stats?.products ?? '...'}</p>
          </div>
        </section>
        
      </main>
    </div>
  );
}