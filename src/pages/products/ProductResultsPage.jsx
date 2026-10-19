import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { FaArrowRight, FaCartPlus, FaHeart, FaStar } from 'react-icons/fa'
import { useStore } from '../../context/useStore.js'
import './ProductResultsPage.css'

const SEARCH_API = 'https://dummyjson.com/products/search'
const CATEGORY_API = 'https://dummyjson.com/products/category'
const PAGE_SIZE = 24
const CATEGORY_ALIASES = {
  laptop: 'laptops',
  laptops: 'laptops',
  notebook: 'laptops',
  notebooks: 'laptops',
  phone: 'smartphones',
  phones: 'smartphones',
  mobile: 'smartphones',
  mobiles: 'smartphones',
  smartphone: 'smartphones',
  smartphones: 'smartphones',
  tablet: 'tablets',
  tablets: 'tablets',
}

function ProductResultsPage({ mode }) {
  const { categorySlug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.trim() || ''
  const searchCategory = CATEGORY_ALIASES[query.toLowerCase()]
  const requestedCategory = mode === 'category' ? categorySlug : searchCategory
  const [products, setProducts] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [pagination, setPagination] = useState({ key: '', page: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart, isFavorite, toggleFavorite } = useStore()
  const pageKey = `${mode}:${requestedCategory || query}`
  const currentPage = pagination.key === pageKey ? pagination.page : 1
  const pageCount = Math.ceil(totalProducts / PAGE_SIZE)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      if (mode === 'search' && !query) {
        setProducts([])
        setTotalProducts(0)
        setLoading(false)
        setError('')
        return
      }

      setLoading(true)
      setError('')

      try {
        const skip = (currentPage - 1) * PAGE_SIZE
        const url = requestedCategory
          ? `${CATEGORY_API}/${encodeURIComponent(requestedCategory)}?limit=${PAGE_SIZE}&skip=${skip}`
          : `${SEARCH_API}?q=${encodeURIComponent(query)}&limit=${PAGE_SIZE}&skip=${skip}`
        const response = await fetch(url, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Could not load products (${response.status})`)
        }

        const data = await response.json()
        if (!Array.isArray(data.products) || !Number.isInteger(data.total)) {
          throw new Error('The products response has an unexpected format')
        }

        setProducts(data.products)
        setTotalProducts(data.total)
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Could not load products')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [currentPage, mode, query, requestedCategory])

  const title = requestedCategory
    ? requestedCategory.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : query

  return (
    <main className="product-results-page">
      <div className="container">
        <header className="product-results-heading">
          <p>{mode === 'category' || searchCategory ? 'SHOP BY CATEGORY' : 'SEARCH RESULTS'}</p>
          <h1>{title ? `Products for “${title}”` : 'Search products'}</h1>
          {!loading && !error && (
            <span>{totalProducts} {totalProducts === 1 ? 'product' : 'products'} found</span>
          )}
        </header>

        {loading && (
          <div aria-label="Loading products" className="product-results-grid">
            {Array.from({ length: 8 }, (_, index) => (
              <div className="product-results-skeleton" key={index} />
            ))}
          </div>
        )}

        {error && <p className="product-results-state product-results-state--error" role="alert">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <section className="product-results-state">
            <h2>{query ? `No products found for “${query}”` : 'Enter a search term to find products'}</h2>
            <p>Try another product name or choose a category from the menu.</p>
            <Link to="/" className="product-results-home">Continue shopping <FaArrowRight aria-hidden="true" /></Link>
          </section>
        )}

        {!loading && !error && products.length > 0 && (
          <section aria-label={`${title} products`} className="product-results-grid">
            {products.map((product) => {
              const favorite = isFavorite(product.id)
              const price = Number(product.price || 0) * (1 - Number(product.discountPercentage || 0) / 100)

              return (
                <article className="product-card product-results-card" key={product.id}>
                  <div className="product-card__image-wrap">
                    <Link
                      aria-label={`View ${product.title} details`}
                      className="product-card__image-link"
                      state={{ product }}
                      to={`/products/${product.id}`}
                    >
                      <img
                        alt={product.title}
                        className="product-card__image"
                        decoding="async"
                        loading="lazy"
                        src={product.thumbnail}
                      />
                    </Link>
                    <div className="product-card__actions">
                      <button
                        aria-label={favorite ? `Remove ${product.title} from favorites` : `Add ${product.title} to favorites`}
                        aria-pressed={favorite}
                        className={`product-card__action${favorite ? ' product-card__action--active' : ''}`}
                        onClick={() => toggleFavorite(product)}
                        type="button"
                      >
                        <FaHeart aria-hidden="true" />
                      </button>
                      <button
                        aria-label={`Add ${product.title} to cart`}
                        className="product-card__action"
                        disabled={product.stock < 1}
                        onClick={() => addToCart(product)}
                        type="button"
                      >
                        <FaCartPlus aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div className="product-card__info">
                    <Link className="product-card__title" state={{ product }} to={`/products/${product.id}`}>{product.title}</Link>
                    <div className="product-card__meta">
                      <span className="product-card__rating"><FaStar aria-hidden="true" /> {Number(product.rating || 0).toFixed(1)}</span>
                      <span className="product-card__price">${price.toFixed(2)}</span>
                    </div>
                    {product.discountPercentage > 0 && (
                      <p className="product-card__old-price">
                        <del>${Number(product.price || 0).toFixed(2)}</del>
                        <span>{Math.round(product.discountPercentage)}% off</span>
                      </p>
                    )}
                    <Link className="product-card__details" state={{ product }} to={`/products/${product.id}`}>
                      View details <FaArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </section>
        )}

        {!loading && !error && pageCount > 1 && (
          <nav aria-label="Products pages" className="product-results-pagination">
            <button
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPagination({ key: pageKey, page: currentPage - 1 })}
              type="button"
            >
              Previous
            </button>
            <span>Page {currentPage} of {pageCount}</span>
            <button
              aria-label="Next page"
              disabled={currentPage === pageCount}
              onClick={() => setPagination({ key: pageKey, page: currentPage + 1 })}
              type="button"
            >
              Next
            </button>
          </nav>
        )}
      </div>
    </main>
  )
}

export default ProductResultsPage
