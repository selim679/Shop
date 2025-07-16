import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import './style/ShopCategory.css';
import Navbar from './Navbar';

// Mise à jour automatique - Filtre prix en haut
export default function ShopWomen() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5002/api/products/category/women`);
        const json = await res.json();
        if (!json.success || !Array.isArray(json.data)) throw new Error('Invalid category or response');
        setProducts(json.data);
        setError('');
      } catch (err) {
        console.error('Error loading products:', err);
        setProducts([]);
        setError('Aucun produit trouvé ou catégorie invalide.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSizeFilter = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleColorFilter = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const filteredProducts = products.filter(product => {
    const priceInRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const sizeMatch = selectedSizes.length === 0 || 
      (product.sizes && selectedSizes.some(size => product.sizes.includes(size)));
    const colorMatch = selectedColors.length === 0 || 
      (product.colors && selectedColors.some(color => product.colors.some(c => c.name === color)));
    return priceInRange && sizeMatch && colorMatch;
  });

  const availableSizes = [...new Set(products.flatMap(p => p.sizes || []))];
  const availableColors = [...new Set(products.flatMap(p => p.colors || []).map(c => c.name))];

  if (loading) {
    return (
      <div className="shop-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des produits femmes...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="shop-category-container">
        
        <div className="shop-header" style={{backgroundColor: 'yellow', border: '3px solid red'}}>
          <div className="shop-title">
            <h1 style={{color: 'red', fontSize: '40px'}}>WOMEN</h1>
            <p style={{color: 'blue', fontSize: '18px'}}>{filteredProducts.length} produits trouvés</p>
          </div>
          
          <div className="price-filter-header">
            <div className="price-filter-container" style={{backgroundColor: 'orange', border: '2px solid black'}}>
              <label style={{color: 'red', fontWeight: 'bold', fontSize: '16px'}}>🎯 PRIX MAX: ${priceRange[1]} - FILTRE EN HAUT 🎯</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="price-slider-header"
                style={{backgroundColor: 'purple'}}
              />
              <button 
                className="clear-filters"
                onClick={() => {
                  setPriceRange([0, 1000]);
                }}
                style={{height: 'fit-content', marginLeft: '2rem'}}
              >
                Effacer les filtres
              </button>
            </div>
          </div>
        </div>

        <div className="shop-content">
          
          {/* Sidebar supprimée car les filtres sont en haut */}
          {/* <div className="filters-sidebar"> ... </div> */}

          <div className="products-section">
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}

            {filteredProducts.length === 0 && !error && (
              <div className="no-products">
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos filtres</p>
              </div>
            )}

            <div className="products-grid">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="product-card">
                  <div className="product-image-container">
                    <img
                      src={`http://localhost:5002${prod.imageUrl}`}
                      alt={prod.name}
                      className="product-image"
                    />
                    <div className="product-overlay">
                      <button 
                        className="quick-view-btn"
                        onClick={() => navigate(`/product/${prod.id}`)}
                      >
                        Voir détails
                      </button>
                      <button 
                        className="quick-add-btn"
                        onClick={() => addToCart(prod)}
                      >
                        + Panier
                      </button>
                    </div>
                    {prod.original_price && prod.original_price > prod.price && (
                      <div className="discount-badge">
                        -{Math.round(((prod.original_price - prod.price) / prod.original_price) * 100)}%
                      </div>
                    )}
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name">{prod.name}</h3>
                    <p className="product-description">{prod.description}</p>
                    
                    <div className="product-pricing">
                      <span className="current-price">${prod.price}</span>
                      {prod.original_price && prod.original_price > prod.price && (
                        <span className="original-price">${prod.original_price}</span>
                      )}
                    </div>
                    
                    <div className="product-actions">
                      <button 
                        className="view-product-btn"
                        onClick={() => navigate(`/product/${prod.id}`)}
                      >
                        Voir le produit
                      </button>
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(prod)}
                      >
                        Ajouter au panier
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
