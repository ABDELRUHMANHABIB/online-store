import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight, FaBoxOpen, FaEnvelope, FaHeadphones, FaHeart, FaShieldAlt } from 'react-icons/fa'
import SlideProduct from '../../components/products/SlideProduct.jsx'
import './StaticPages.css'

export function AboutPage() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="container static-hero__content">
          <p className="static-eyebrow">ABOUT OUR STORE</p>
          <h1>Everyday finds, made simple.</h1>
          <p>
            Abdelrahman Online Store brings useful products together in one easy place.
            Explore our collections, compare your favorites, and choose what works for you.
          </p>
          <Link className="static-button" to="/accessories">
            Explore accessories <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="container about-values">
        <article className="about-value">
          <span><FaBoxOpen aria-hidden="true" /></span>
          <h2>A considered collection</h2>
          <p>Browse products across technology, lifestyle, and everyday accessories.</p>
        </article>
        <article className="about-value">
          <span><FaHeart aria-hidden="true" /></span>
          <h2>Shopping your way</h2>
          <p>Save favorites for later and keep your cart ready as you explore.</p>
        </article>
        <article className="about-value">
          <span><FaShieldAlt aria-hidden="true" /></span>
          <h2>Clear product details</h2>
          <p>Review product information and availability before making your choice.</p>
        </article>
      </section>
    </main>
  )
}

export function AccessoriesPage() {
  return (
    <main className="accessories-page">
      <section className="static-hero static-hero--accessories">
        <div className="container static-hero__content">
          <p className="static-eyebrow">THE FINISHING TOUCHES</p>
          <h1>Accessories for every day.</h1>
          <p>Find useful extras for your devices, training, and everyday routine.</p>
        </div>
      </section>
      <SlideProduct title="mobile accessories" />
      <SlideProduct title="sports accessories" />
    </main>
  )
}

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="static-page contact-page">
      <section className="static-hero static-hero--contact">
        <div className="container static-hero__content">
          <p className="static-eyebrow">WE'RE HERE TO HELP</p>
          <h1>Get in touch.</h1>
          <p>Have a question about a product or need help finding something? Send us a note.</p>
        </div>
      </section>

      <section className="container contact-layout">
        <div className="contact-intro">
          <span className="contact-intro__icon"><FaHeadphones aria-hidden="true" /></span>
          <h2>How can we help?</h2>
          <p>Use the form to share your question, and include the product name if your message is about a specific item.</p>
          <div className="contact-help-card">
            <FaEnvelope aria-hidden="true" />
            <div>
              <strong>Product and order questions</strong>
              <span>Tell us what you need help with in the message below.</span>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send a message</h2>
          <label>
            Your name
            <input autoComplete="name" name="name" placeholder="Name" required />
          </label>
          <label>
            Email address
            <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
          </label>
          <label>
            Message
            <textarea name="message" placeholder="How can we help?" required rows="5" />
          </label>
          <button className="static-button" type="submit">Prepare message <FaArrowRight aria-hidden="true" /></button>
          {submitted && (
            <p className="contact-form__notice" role="status">
              Thanks for reaching out. This demo form is not connected to a message delivery service yet.
            </p>
          )}
          <p className="contact-form__disclaimer">This form is a front-end demo and does not send or store your message.</p>
        </form>
      </section>
    </main>
  )
}
