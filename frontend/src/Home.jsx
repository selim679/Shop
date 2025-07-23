import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './style/Home.css';

export default function Home() {
  const [faqOpen, setFaqOpen] = useState(null);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="home-page">
      
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


      

   
      <div className="main-banner" id="top">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6">
              <div className="left-content">
                <div className="thumb position-relative">
                  <img src="/images/left-banner-image.png" alt="" className="img-fluid w-100" style={{objectFit: 'cover'}} />
                  <div className="banner-overlay position-absolute top-50 start-50 translate-middle text-center w-100 px-2" style={{zIndex: 2}}>
                    <h3 className="fw-bold m-0 text-white text-shadow" style={{fontSize: 'clamp(1.2rem,4vw,2rem)'}}>
                      Welcome to Maison Langford
                    </h3>
                    <span className="d-block mt-1 text-white text-shadow" style={{fontSize: 'clamp(1rem,2.5vw,1.2rem)'}}>
                      Luxury is in each detail
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="right-content">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="right-first-image">
                      <div className="thumb">
                        <div className="inner-content">
                          <h4>Women</h4>
                          <span>Best Clothes For Women</span>
                        </div>
                        <div className="hover-content">
                          <div className="inner">
                            <h4>Women</h4>
                            <p>Discover our elegant collection of women's fashion.</p>
                            <div className="main-border-button">
                              <Link to="/shop/women">Discover More</Link>
                            </div>
                          </div>
                        </div>
                        <img src="/images/baner-right-image-01.jpg" alt="Women's Fashion" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="right-first-image">
                      <div className="thumb">
                        <div className="inner-content">
                          <h4>Men</h4>
                          <span>Best Clothes For Men</span>
                        </div>
                        <div className="hover-content">
                          <div className="inner">
                            <h4>Men</h4>
                            <p>Explore our sophisticated men's clothing collection.</p>
                            <div className="main-border-button">
                              <Link to="/shop/men">Discover More</Link>
                            </div>
                          </div>
                        </div>
                        <img src="/images/baner-right-image-02.jpg" alt="Men's Fashion" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="right-first-image">
                      <div className="thumb">
                        <div className="inner-content">
                          <h4>Kids</h4>
                          <span>Best Clothes For Kids</span>
                        </div>
                        <div className="hover-content">
                          <div className="inner">
                            <h4>Kids</h4>
                            <p>Comfortable and stylish clothing for children.</p>
                            <div className="main-border-button">
                              <Link to="/shop/kids">Discover More</Link>
                            </div>
                          </div>
                        </div>
                        <img src="/images/baner-right-image-03.jpg" alt="Kids Fashion" />
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="right-first-image">
                      <div className="thumb">
                        <div className="inner-content">
                          <h4>Accessories</h4>
                          <span>Best Trend Accessories</span>
                        </div>
                        <div className="hover-content">
                          <div className="inner">
                            <h4>Accessories</h4>
                            <p>Complete your look with our trendy accessories.</p>
                            <div className="main-border-button">
                              <Link to="/accessories">Discover More</Link>
                            </div>
                          </div>
                        </div>
                        <img src="/images/baner-right-image-04.jpg" alt="Accessories" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="faq-wrapper">
        <h4 style={{textAlign: 'center'}}>WE ARE HERE TO ANSWER YOUR QUESTIONS</h4>
        <h2 style={{textAlign: 'center'}}>FREQUENTLY ASKED QUESTIONS</h2>

        <div className="faq-section">
          <div className={`faq ${faqOpen === 0 ? 'open' : ''}`}>
            <div className="faq-title" onClick={() => toggleFaq(0)}>
              Do you ship overseas? <span>{faqOpen === 0 ? '-' : '+'}</span>
            </div>
            <div className="faq-content">
              <p>Yes, we ship all over the world. We currently ship to 65+ countries. Shipping costs will apply, and will be added at <strong>checkout</strong></p>
              <p>Currently Free Shipping applies on orders over $85</p>
              <p>We run discounts and promotions all year, so stay tuned for exclusive deals on shipping</p>
            </div>
          </div>
          <div className={`faq ${faqOpen === 1 ? 'open' : ''}`}>
            <div className="faq-title" onClick={() => toggleFaq(1)}>
              How long will it take to get my orders? <span>{faqOpen === 1 ? '-' : '+'}</span>
            </div>
            <div className="faq-content">
              <p>We are currently experiencing a very high order volume, all orders will be dispatched within 24-48 hours, and shipping will take around 5-7 business days depending on your location. We ship to all countries except some Islands</p>
              <p>Delivery details will be provided during checkout & in your confirmation email</p>
            </div>
          </div>
          <div className={`faq ${faqOpen === 2 ? 'open' : ''}`}>
            <div className="faq-title" onClick={() => toggleFaq(2)}>
              Do you ship to my country? <span>{faqOpen === 2 ? '-' : '+'}</span>
            </div>
            <div className="faq-content">
              <p>We excluded countries we can not ship to, from checking out. This means if you are able to check-out, we can ship to your country</p>
            </div>
          </div>
          <div className={`faq ${faqOpen === 3 ? 'open' : ''}`}>
            <div className="faq-title" onClick={() => toggleFaq(3)}>
              What are the return rules? <span>{faqOpen === 3 ? '-' : '+'}</span>
            </div>
            <div className="faq-content">
              <p>You can return a product for any reason within 14-days guaranteed. No questions asked</p>
              <p>We do not charge a return or handling fee</p>
              <p>The customer only have to bare the return label</p>
            </div>
          </div>
          <div className={`faq ${faqOpen === 4 ? 'open' : ''}`}>
            <div className="faq-title" onClick={() => toggleFaq(4)}>
              Other questions? <span>{faqOpen === 4 ? '-' : '+'}</span>
            </div>
            <div className="faq-content">
              <p>You can contact us through our contact page! We will be happy to assist you.</p>
            </div>
          </div>
        </div>
      </section>


      <section className="features-section">
        <div className="features-wrapper">
          <div className="feature">
            <img src="/images/shipping.png" alt="Free Shipping" />
            <h3>FREE SHIPPING</h3>
            <p>We offer free worldwide shipping on orders over $100</p>
          </div>
          <div className="feature">
            <img src="/images/support.jpg" alt="Customer Service" />
            <h3>CUSTOMER SERVICE</h3>
            <p>Our customer service team is available<br />Monday till Friday from 9am - 6pm</p>
          </div>
          <div className="feature">
            <img src="/images/security.jpg" alt="Secure Payments" />
            <h3>SECURE PAYMENTS</h3>
            <p>We offer secure payments using<br />Creditcard, PayPal, ShopPay and Amazon Pay.</p>
          </div>
        </div>
      </section>

  
      <iframe 
        className="map" 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d41754.138784297465!2d2.2798647415522764!3d48.86001079066407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e1f06e2b70f%3A0x40b82c3688c9460!2sParis%2C%20France!5e1!3m2!1sfr!2stn!4v1749823402508!5m2!1sfr!2stn" 
        width="600" 
        height="450" 
        style={{border: 0}} 
        allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Location Map"
      />

    
      <footer className="site-footer">
        <div className="footer-container">
          <div className="footer-section brand">
            <h2>MAISON LONGFORD</h2>
            <p>Sign up to our e-mail list for exclusive discounts & free product give-aways.</p>
            <form className="email-signup">
              <input type="email" placeholder="E-mail" required />
              <button id="submit-button" type="submit">SUBMIT</button>
            </form>
          </div>

          <div className="footer-section">
            <h4>MAIN-MENU</h4>
            <ul>
              <li><Link to="/shop/men">Shop men</Link></li>
              <li><Link to="/shop/women">Shop women</Link></li>
              <li><Link to="/shop/kids">Shop kids</Link></li>
              <li><Link to="/accessories">Accessories</Link></li>
              <li><Link to="/contact">Contact us</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>FOOTER MENU</h4>
            <ul>
              <li><Link to="/bestsellers">Bestsellers</Link></li>
              <li><Link to="/ambassador">Become an Ambassador</Link></li>
              <li><Link to="/track-order">Track Your Order</Link></li>
              <li><Link to="/support">Get Support</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/refund">Refund Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/blog">Blogs</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>SUPPORT</h4>
            <p>Our only support e-mail is:<br /><strong>support@maison-longford.com</strong></p>
            <p>Old Money // Stay Limitless LLC<br />
               228 Park Ave S PMB 43559<br />
               Paris, NY 10003-1502, France</p>
            <p>💚 We donate our returns to a good cause in collaboration with GiveBackBox.</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="social-icons">
            <a href="https://www.instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
              <img src="/images/icons8-instagram-32.png" alt="Instagram" style={{width: '24px', height: '24px'}} />
            </a>
            <a href="https://www.tiktok.com/@yourusername" target="_blank" rel="noopener noreferrer">
              <img src="/images/icons8-tiktok-24.png" alt="TikTok" style={{width: '24px', height: '24px'}} />
            </a>
          </div>
          <p>&copy; 2025, Maison Longford.</p>
        </div>
      </footer>
    </div>
  );
} 
