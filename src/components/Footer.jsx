import { FaFacebookF, FaInstagram, FaRegEnvelope } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__main">
        <section className="site-footer__brand">
          <Link className="site-footer__logo" to="/">Abdelrahman Store</Link>
          <p>Everyday finds, made simple. Discover useful products for your home, work, and lifestyle.</p>
          <div aria-label="Social media" className="site-footer__social">
            <a aria-label="Facebook" href="https://www.facebook.com/" rel="noreferrer" target="_blank"><FaFacebookF /></a>
            <a aria-label="Instagram" href="https://www.instagram.com/" rel="noreferrer" target="_blank"><FaInstagram /></a>
            <a aria-label="Email" href="mailto:hello@example.com"><FaRegEnvelope /></a>
          </div>
        </section>

        <nav aria-label="Footer navigation" className="site-footer__links">
          <h2>Explore</h2>
          <Link to="/">Home</Link>
          <Link to="/about">About us</Link>
          <Link to="/accessories">Accessories</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <nav aria-label="Shopping links" className="site-footer__links">
          <h2>Your account</h2>
          <Link to="/favorites">Favorites</Link>
          <Link to="/cart">Shopping cart</Link>
          <Link to="/category/smartphones">Smartphones</Link>
          <Link to="/category/laptops">Laptops</Link>
        </nav>
      </div>
      <div className="site-footer__bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} Abdelrahman Online Store. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
