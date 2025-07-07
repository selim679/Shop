import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext'; // Assure-toi que ce chemin est correct

export default function ShopMen() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart(); // Hook du contexte panier

  useEffect(() => {
    fetch('http://localhost:5002/api/products/category/men')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <h1>Shop Men</h1>
      <div className="product-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((prod) => (
          <div key={prod.id} className="product-card" style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
            <img
              src={`http://localhost:5002${prod.imageUrl}`}
              alt={prod.name}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            <h4>{prod.name}</h4>
            <p>{prod.description}</p>
            <p style={{ fontWeight: 'bold' }}>${prod.price}</p>
            <button onClick={() => navigate('/product/' + prod.id)} style={{ marginTop: '10px' }}>
              Voir le produit
            </button>
            <button onClick={() => addToCart(prod)} style={{ marginTop: '10px' }}>
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
