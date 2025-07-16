import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Admin.css';

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    image: null, 
    category: 'men', 
    price: '',
    originalPrice: '',
    sizes: 'S,M,L,XL',
    colors: JSON.stringify([
      { name: "Beige", image: "" },
      { name: "Blue", image: "" },
      { name: "White", image: "" }
    ])
  });
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [colorImages, setColorImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (role !== 'admin' || !token) {
      navigate('/login');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else if (name.startsWith('colorImage')) {
      const index = parseInt(name.replace('colorImage', ''));
      const newColorImages = [...colorImages];
      newColorImages[index] = files[0];
      setColorImages(newColorImages);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    
    data.append('name', form.name);
    data.append('description', form.description);
    data.append('category', form.category);
    data.append('price', form.price);
    data.append('originalPrice', form.originalPrice || form.price);
    data.append('sizes', form.sizes);
    data.append('colors', form.colors);
    
 
    if (form.image) data.append('image', form.image);
    
    
    colorImages.forEach(file => {
      if (file) data.append('colorImages', file);
    });

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5002/api/products', {
        method: 'POST',
        body: data,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add product');
      }
      
      const product = await res.json();
      setProducts([...products, product.data]);
      
     
      setForm({ 
        name: '', 
        description: '', 
        image: null, 
        category: 'men', 
        price: '',
        originalPrice: '',
        sizes: 'S,M,L,XL',
        colors: JSON.stringify([
          { name: "Beige", image: "" },
          { name: "Blue", image: "" },
          { name: "White", image: "" }
        ])
      });
      setPreview(null);
      setColorImages([]);
      setMessage('Product added successfully!');
    } catch (err) {
      console.error('Error:', err);
      setMessage(`Error: ${err.message}`);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5002/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setMessage('Failed to load products');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5002/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Delete failed');
      
      setProducts(products.filter(p => p.id !== id));
      setMessage('Product deleted');
    } catch (err) {
      console.error('Error:', err);
      setMessage('Delete failed');
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const parsedColors = JSON.parse(form.colors);

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin</h2>
        <nav>
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="active" onClick={() => navigate('/admin')}>Produits</button>
          <button onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}>Déconnexion</button>
        </nav>
      </aside>
      <main className="admin-main">
        <header className="admin-header">
          <h1>Gestion des produits</h1>
        </header>
        <section className="admin-products">
          <button
            type="button"
            style={{ marginBottom: '10px', background: '#43e97b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
            onClick={() => setForm({
              ...form,
              category: 'accessories',
              sizes: '',
              colors: JSON.stringify([{ name: "", image: "" }])
            })}
          >
            Ajouter un accessoire
          </button>
          <form onSubmit={handleSubmit} className="product-form">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product Name"
              required
            />
            
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
            
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
              <option value="accessories">Accessories</option>
            </select>
            
            <div className="price-fields">
              <input
                type="number"
                name="originalPrice"
                value={form.originalPrice}
                onChange={handleChange}
                placeholder="Original Price"
                min="0"
                step="0.01"
                required
              />
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Promo Price"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="image-upload">
              <label>Main Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
              />
              {preview && <img src={preview} alt="Preview" className="image-preview" />}
            </div>
            
            {/* Affiche tailles/couleurs seulement si ce n'est PAS un accessoire */}
            {form.category !== 'accessories' && (
              <>
                <div className="sizes">
                  <label>Sizes (comma separated)</label>
                  <input
                    type="text"
                    name="sizes"
                    value={form.sizes}
                    onChange={handleChange}
                    placeholder="S,M,L,XL"
                  />
                </div>
                <div className="colors">
                  <label>Colors</label>
                  {parsedColors.map((color, index) => (
                    <div key={index} className="color-option">
                      <input
                        type="text"
                        value={color.name}
                        onChange={(e) => {
                          const newColors = [...parsedColors];
                          newColors[index].name = e.target.value;
                          setForm({...form, colors: JSON.stringify(newColors)});
                        }}
                        placeholder="Color name"
                      />
                      <input
                        type="file"
                        name={`colorImage${index}`}
                        accept="image/*"
                        onChange={handleChange}
                      />
                      {colorImages[index] && (
                        <img src={URL.createObjectURL(colorImages[index])} alt="Preview" className="color-preview" />
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="add-color-btn"
                    onClick={() => {
                      const newColors = [...parsedColors, { name: '', image: '' }];
                      setForm({...form, colors: JSON.stringify(newColors)});
                    }}
                  >
                    Add Color
                  </button>
                </div>
              </>
            )}
            
            <button type="submit" className="submit-btn">Add Product</button>
          </form>
          
          {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
            {message}
          </div>}
          
          <h2>Products</h2>
          <table className="products-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td><img src={`http://localhost:5002${product.imageUrl}`} alt={product.name} className="table-img" /></td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(product.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default Admin;