import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import '../style/ShopCategory.css';

export default function ShopCategory() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5002/api/products/category/${category}`);
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
  }, [category]);

  const handleSizeFilter = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const filteredProducts = products.filter(product => {
    const priceInRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const sizeMatch = selectedSizes.length === 0 || 
      (product.sizes && selectedSizes.some(size => product.sizes.includes(size)));
    return priceInRange && sizeMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const availableSizes = [...new Set(products.flatMap(p => p.sizes || []))];

  if (loading) {
    return (
      <div className="shop-loading">
        <div className="loading-spinner"></div>
        <p>Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="shop-category-container">
      
      <div className="shop-header">
        <div className="shop-title">
          <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
          <p>{filteredProducts.length} produits trouvés</p>
        </div>
        
        <div className="filters-top" style={{display: 'flex', gap: '2rem', marginTop: '1rem', alignItems: 'center'}}>
          <div className="filter-group">
            <h4>Prix</h4>
            <div className="price-range">
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="price-slider-header"
              />
              <div className="price-labels">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
          <button
            className="clear-filters"
            onClick={() => setPriceRange([0, 1000])}
            style={{height: 'fit-content', marginLeft: '2rem'}}
          >
            Effacer les filtres
          </button>
        </div>
      </div>

      <div className="shop-content">
        

       
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
            {sortedProducts.map((prod) => (
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

                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
