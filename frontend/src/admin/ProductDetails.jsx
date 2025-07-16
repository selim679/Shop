import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import '../style/ProductDetails.css';
import Navbar from '../Navbar';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedOption, setSelectedOption] = useState('SINGLE');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5002/api/products/${id}`);
        const result = await response.json();

        if (result.success === false) {
          setError(result.message);
          return;
        }

        const productData = result.data;
        setProduct(productData);
        
        let mainImg = '';
        if (productData.category === 'accessories' || !productData.colors || productData.colors.length === 0) {
          mainImg = `http://localhost:5002${productData.image_url}`;
        } else {
          mainImg = `http://localhost:5002${productData.colors[0].image}`;
        }
        setMainImage(mainImg);
        
        setSelectedSize(productData.sizes?.[0] || '');
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Veuillez sélectionner une taille');
      return;
    }

    const price = selectedOption === 'SINGLE' ? product.price : product.price * 2 * 0.9;
    const item = {
      ...product,
      size: selectedSize,
      option: selectedOption,
      quantity,
      price
    };
    addToCart(item);
    navigate('/cart');
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="product-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du produit...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-error">
        <h2>Erreur</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/shop/men')}>Retourner au magasin</button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <>
      <Navbar />
      <div className="product-detail-container">
        <div className="product-breadcrumb">
          <span onClick={() => navigate('/shop/men')}>Accueil</span>
          <span>/</span>
          <span onClick={() => navigate(`/shop/${product.category}`)}>
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </span>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className="product-main">
          {/* image */}
          <div className="product-gallery">
            <div className="main-image-container">
              <img
                src={mainImage}
                alt={product.name}
                className="main-image"
              />
              <div className="image-overlay">
                <button className="zoom-btn">🔍</button>
              </div>
            </div>
            {/* Affiche les couleurs seulement si ce n'est PAS un accessoire */}
            {product.category !== 'accessories' && product.colors && product.colors.length > 0 && (
              <div className="color-thumbnails">
                {product.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className={`color-thumbnail ${mainImage.includes(color.image) ? 'active' : ''}`}
                    onClick={() => setMainImage(`http://localhost:5002${color.image}`)}
                  >
                    <img
                      src={`http://localhost:5002${color.image}`}
                      alt={color.name}
                    />
                    <span className="color-name">{color.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* product info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <div className="product-rating">
                <div className="stars">★★★★★</div>
                <span>(4.8/5)</span>
              </div>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-pricing">
              <div className="price-container">
                <span className="current-price">${product.price}</span>
                {product.original_price && product.original_price > product.price && (
                  <span className="original-price">${product.original_price}</span>
                )}
                {product.original_price && product.original_price > product.price && (
                  <span className="discount-badge">
                    -{Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </span>
                )}
              </div>
            </div>

            {/* Affiche tailles/options/quantité seulement si ce n'est PAS un accessoire */}
            {product.category !== 'accessories' && (
              <>
                {/* size */}
                <div className="size-section">
                  <h3>Taille</h3>
                  <div className="size-options">
                    {product.sizes?.map((size, idx) => (
                      <button
                        key={idx}
                        className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {!selectedSize && (
                    <p className="size-warning">Veuillez sélectionner une taille</p>
                  )}
                </div>

                {/* quantity */}
                <div className="quantity-section">
                  <h3>Quantité</h3>
                  <div className="quantity-selector">
                    <button 
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span>{quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* options */}
                <div className="purchase-options">
                  <h3>Options d'achat</h3>
                  <div className="options-container">
                    <div
                      className={`option-card ${selectedOption === 'SINGLE' ? 'selected' : ''}`}
                      onClick={() => setSelectedOption('SINGLE')}
                    >
                      <div className="option-header">
                        <h4>SINGLE</h4>
                        <div className="option-badge">Standard</div>
                      </div>
                      <p>Prix standard</p>
                      <div className="option-price">${product.price}</div>
                      {product.original_price && (
                        <div className="option-original">${product.original_price}</div>
                      )}
                    </div>
                    <div
                      className={`option-card ${selectedOption === 'DUO' ? 'selected' : ''}`}
                      onClick={() => setSelectedOption('DUO')}
                    >
                      <div className="option-header">
                        <h4>DUO</h4>
                        <div className="option-badge discount">-10%</div>
                      </div>
                      <p>Économisez 10% par article</p>
                      <div className="option-price">${(product.price * 2 * 0.9).toFixed(2)}</div>
                      {product.original_price && (
                        <div className="option-original">${(product.original_price * 2).toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* add to cart */}
            <div className="cart-actions">
              <button
                className="add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.category !== 'accessories' && !selectedSize}
              >
                <span className="cart-icon">🛒</span>
                Ajouter au panier
              </button>
              
              <button className="wishlist-btn">
                <span>❤</span>
              </button>
            </div>

            {/* product features */}
            <div className="product-features">
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
                  <h4>Garantie 2 ans</h4>
                  <p>Protection complète</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
