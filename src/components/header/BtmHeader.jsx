

import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars, FaChevronDown, FaSignOutAlt } from 'react-icons/fa'

const CATEGORIES_API = 'https://dummyjson.com/products/categories'

function BtmHeader() {
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState('')
  const location = useLocation()

  useEffect(() => {
    const controller = new AbortController()

    async function loadCategories() {
      try {
        const response = await fetch(CATEGORIES_API, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Could not load categories (${response.status})`)
        }

        const data = await response.json()
        if (!Array.isArray(data) || !data.every((category) => (
          typeof category.slug === 'string' && typeof category.name === 'string'
        ))) {
          throw new Error('The categories response has an unexpected format')
        }

        setCategories(data)
        setCategoriesError('')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setCategoriesError(error.message || 'Could not load categories')
        }
      } finally {
        if (!controller.signal.aborted) {
          setCategoriesLoading(false)
        }
      }
    }

    loadCategories()

    return () => controller.abort()
  }, [])

  return (
    <nav aria-label="Main navigation" className="bottom-header">
      <div className="container bottom-header__inner">
        <div className="category-menu">
          <button
            aria-expanded={categoriesOpen}
            className="category-menu__toggle"
            onClick={() => setCategoriesOpen((open) => !open)}
            type="button"
          >
            <FaBars aria-hidden="true" className="category-menu__bars" />
            <span>Browse Category</span>
            <FaChevronDown aria-hidden="true" className="category-menu__chevron" />
          </button>
          {categoriesOpen && (
            <div aria-live="polite" className="category-menu__dropdown">
              {categoriesLoading && <p className="category-menu__message">Loading categories...</p>}
              {categoriesError && (
                <p className="category-menu__message category-menu__message--error" role="alert">
                  {categoriesError}
                </p>
              )}
              {!categoriesLoading && !categoriesError && categories.map((category) => (
                <Link
                  to={`/category/${category.slug}`}
                  key={category.slug}
                  onClick={() => {
                    setCategoriesOpen(false)
                    setNavigationOpen(false)
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <button
          aria-expanded={navigationOpen}
          aria-label="Toggle navigation"
          className="mobile-navigation-toggle"
          onClick={() => setNavigationOpen((open) => !open)}
          type="button"
        >
          <FaBars aria-hidden="true" />
        </button>

        <div className={`main-navigation${navigationOpen ? ' main-navigation--open' : ''}`}>
          <Link
            aria-current={location.pathname === '/' ? 'page' : undefined}
            className={`main-navigation__link${location.pathname === '/' ? ' main-navigation__link--active' : ''}`}
            onClick={() => setNavigationOpen(false)}
            to="/"
          >
            Home
          </Link>
          <Link
            aria-current={location.pathname === '/about' ? 'page' : undefined}
            className={`main-navigation__link${location.pathname === '/about' ? ' main-navigation__link--active' : ''}`}
            onClick={() => setNavigationOpen(false)}
            to="/about"
          >
            About
          </Link>
          <Link
            aria-current={location.pathname === '/accessories' ? 'page' : undefined}
            className={`main-navigation__link${location.pathname === '/accessories' ? ' main-navigation__link--active' : ''}`}
            onClick={() => setNavigationOpen(false)}
            to="/accessories"
          >
            Accessories
          </Link>
          <Link
            aria-current={location.pathname === '/contact' ? 'page' : undefined}
            className={`main-navigation__link${location.pathname === '/contact' ? ' main-navigation__link--active' : ''}`}
            onClick={() => setNavigationOpen(false)}
            to="/contact"
          >
            Contact
          </Link>
        </div>

        <Link aria-label="Go to home page" className="home-navigation-link" to="/">
          <FaSignOutAlt aria-hidden="true" />
        </Link>
      </div>
    </nav>
  )
}

export default BtmHeader
