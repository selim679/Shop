
import React from 'react';
import { useCart } from './CartContext';
import axios from 'axios';
import '../style/Cart.css';

export default function Cart() {
  const { cartItems, removeFromCart } = useCart();

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal > 50 ? 0 : 10;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    console.log("🛒 CartItems envoyés à Stripe:", cartItems); // DEBUG

    try {
      const res = await axios.post('http://localhost:5002/api/create-checkout-session', {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name || 'Produit sans nom',
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1
        })),
      });

      if (res.data?.url) {
        window.location.href = res.data.url;
      } else {
        console.error("Réponse Stripe invalide:", res.data);
        alert("Erreur : URL de redirection manquante.");
      }

    } catch (err) {
      console.error('❌ Erreur lors du checkout Stripe:', err);
      alert('Erreur lors du paiement.');
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
     
      const updatedItems = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
     
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-cart-icon">🛒</div>
        <h2>Votre panier est vide</h2>
        <p>Découvrez nos produits et commencez vos achats</p>
        <button className="continue-shopping-btn" onClick={() => window.history.back()}>
          Continuer les achats
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Votre panier</h1>
        <p>{cartItems.length} article{cartItems.length > 1 ? 's' : ''}</p>
      </div>

      <div className="cart-content">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item, idx) => (
            <div key={idx} className="cart-item">
              <div className="item-image">
                <img 
                  src={`http://localhost:5002${item.imageUrl || item.image_url}`} 
                  alt={item.name}
                />
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-description">{item.description}</p>
                
                <div className="item-options">
                  {item.size && <span className="item-size">Taille: {item.size}</span>}
                  {item.option && <span className="item-option">Option: {item.option}</span>}
                </div>
                
                <div className="item-price">
                  <span className="current-price">${item.price}</span>
                  {item.original_price && item.original_price > item.price && (
                    <span className="original-price">${item.original_price}</span>
                  )}
                </div>
              </div>
              
              <div className="item-quantity">
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="item-total">
                <span className="total-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              
              <button 
                onClick={() => removeFromCart(item.id)}
                className="remove-item-btn"
                title="Supprimer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="cart-summary">
          <h2>Résumé de la commande</h2>
          
          <div className="summary-row">
            <span>Sous-total</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <span>Livraison</span>
            <span>{calculateShipping() === 0 ? 'Gratuit' : `$${calculateShipping().toFixed(2)}`}</span>
          </div>
          
          {calculateShipping() > 0 && (
            <div className="free-shipping-notice">
              <p>Ajoutez ${(50 - calculateSubtotal()).toFixed(2)} pour la livraison gratuite</p>
            </div>
          )}
          
          <div className="summary-row total">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            className="checkout-btn"
          >
            Procéder au paiement 💳
          </button>
          
          <div className="payment-methods">
            <p>Méthodes de paiement acceptées:</p>
            <div className="payment-icons">
              <span>💳</span>
              <span>🏦</span>
              <span>📱</span>
            </div>
          </div>
          
          <div className="cart-features">
            <div className="feature">
              <span className="feature-icon">🚚</span>
              <div>
                <h4>Livraison gratuite</h4>
                <p>Pour toute commande &gt; $50</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🔄</span>
              <div>
                <h4>Retours gratuits</h4>
                <p>Sous 30 jours</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🛡️</span>
              <div>
                <h4>Paiement sécurisé</h4>
                <p>Protection complète</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
