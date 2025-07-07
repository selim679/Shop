import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top shadow">
        <div className="container-fluid">
          <Link className="navbar-brand text-white fw-bold" to="/">Maison Langford</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/">Accueil</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/shop/men">Shop Men</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/shop/women">Shop Women</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/shop/kids">Shop Kids</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/accessories">Accessories</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/cart">🛒 Cart</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Header with Logo and Search */}
      <header className="site-header py-3">
        <div className="container-fluid">
          <div className="row align-items-center gy-2">
            <div className="col-12 col-md-4 left-controls d-flex flex-wrap flex-md-nowrap justify-content-center justify-content-md-start gap-2">
              <Link to="/contact">Contact</Link>
              <Link to="/login">Login</Link>
              <Link to="/create-account">Create Account</Link>
            </div>
            <div className="col-12 col-md-4 center-logo text-center mb-2 mb-md-0">
              <h1 className="m-0" style={{fontSize: 'clamp(1.2rem,4vw,2rem)', wordBreak: 'break-word'}}>
                Maison Langford
              </h1>
            </div>
            <div className="col-12 col-md-4 right-controls d-flex flex-column flex-md-row align-items-center justify-content-center justify-content-md-end gap-2">
              <form className="search-form w-100 w-md-auto mb-2 mb-md-0 d-flex flex-nowrap">
                <input type="text" className="form-control me-2 flex-grow-1" placeholder="Search" />
                <button type="submit" className="btn btn-outline-secondary flex-shrink-0">🔍</button>
              </form>
              <div className="cart text-nowrap">🛒 Your Cart (0)</div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
} 