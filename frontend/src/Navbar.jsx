import React from 'react';
import { NavLink } from 'react-router-dom';
import './style/Navbar.css';

export default function Navbar() {
  return (
    <>
      
      <nav className="navbar navbar-expand-lg navbar-dark bg-black fixed-top shadow">
        <div className="container-fluid">
          <NavLink className="navbar-brand text-white fw-bold" to="/">Maison Langford</NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item"><NavLink className="nav-link" to="/">Accueil</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/shop/men">Shop Men</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/shop/women">Shop Women</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/shop/kids">Shop Kids</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/accessories">Accessories</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/cart">🛒 Cart</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
            </ul>
          </div>
        </div>
      </nav>

      
    </>
  );
} 
