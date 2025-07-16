import React, { useEffect, useState } from 'react';
import '../style/Dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          fetch('http://localhost:5002/api/admin/stats'),
          fetch('http://localhost:5002/api/admin/orders')
        ]);
        
        const statsData = await statsRes.json();
        const ordersData = await ordersRes.json();
        
        setStats(statsData);
        setOrders(ordersData.data || []);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5002/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Recharger les données
        window.location.reload();
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

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
            <p>${stats?.revenue ? parseFloat(stats.revenue).toFixed(2) : '0.00'}</p>
          </div>
          <div className="stat-card">
            <h2>Total Commandes</h2>
            <p>{stats?.orders ?? '0'}</p>
          </div>
          <div className="stat-card">
            <h2>Commandes en attente</h2>
            <p>{stats?.pendingOrders ?? '0'}</p>
          </div>
          <div className="stat-card">
            <h2>Commandes complétées</h2>
            <p>{stats?.completedOrders ?? '0'}</p>
          </div>
          <div className="stat-card">
            <h2>Produits</h2>
            <p>{stats?.products ?? '0'}</p>
          </div>
        </section>

        <section className="orders-section">
          <h2>Commandes récentes</h2>
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>${parseFloat(order.total).toFixed(2)}</td>
                    <td>
                      <span className={`status ${order.status}`}>
                        {order.status === 'pending' ? 'En attente' : 
                         order.status === 'completed' ? 'Complétée' : 
                         order.status === 'cancelled' ? 'Annulée' : order.status}
                      </span>
                    </td>
                    <td>
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="btn-complete"
                        >
                          Marquer comme complétée
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}