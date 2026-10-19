import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowRight,
  FaCartPlus,
  FaChevronLeft,
  FaChevronRight,
  FaDumbbell,
  FaGlasses,
  FaHeart,
  FaHeadphones,
  FaLaptop,
  FaMobileAlt,
  FaStar,
  FaShoppingBag,
  FaTabletAlt,
} from 'react-icons/fa'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useStore } from '../../context/useStore.js'
import 'swiper/css'
import 'swiper/css/navigation'
import './slideproduct.css'

const PRODUCTS_API = 'https://dummyjson.com/products/category'
const CATEGORY_ICONS = {
  smartphones: FaMobileAlt,
  'mobile-accessories': FaHeadphones,
  laptops: FaLaptop,
  tablets: FaTabletAlt,
  sunglasses: FaGlasses,
  'sports-accessories': FaDumbbell,
}

function SlideProduct({ title }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { addToCart, isFavorite, toggleFavorite } = useStore()
  const categorySlug = title.toLowerCase().replaceAll(' ', '-')
  const CategoryIcon = CATEGORY_ICONS[categorySlug]

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `${PRODUCTS_API}/${encodeURIComponent(categorySlug)}?limit=12`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Could not load ${title} (${response.status})`)
        }

        const data = await response.json()
        if (!Array.isArray(data.products)) {
          throw new Error(`The ${title} response has an unexpected format`)
        }

        setProducts(data.products)
      } catch (loadError) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || `Could not load ${title}`)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => controller.abort()
  }, [categorySlug, title])

  return (
    <section aria-labelledby={`category-title-${categorySlug}`} className="product-section" id={`category-${categorySlug}`}>
      <div className="container product-section__layout">
        <aside className="product-section__sidebar">
          <span aria-hidden="true" className="product-section__category-icon">
            {CategoryIcon ? <CategoryIcon /> : <FaShoppingBag />}
          </span>
          <p className="product-section__eyebrow">OUR COLLECTION</p>
          <h2 id={`category-title-${categorySlug}`}>{title}</h2>
          <a aria-label={`Explore ${title}`} className="product-section__browse" href={`#${categorySlug}-products`}>
            Shop <FaArrowRight aria-hidden="true" />
          </a>
        </aside>

        <div className="product-section__products" id={`${categorySlug}-products`}>
          <div className="product-section__toolbar">
            <span>Popular picks</span>
            <div className="product-section__controls">
              <button
                aria-label={`Previous ${title} products`}
                className={`product-section__arrow products-prev-${categorySlug}`}
                type="button"
              >
                <FaChevronLeft aria-hidden="true" />
              </button>
              <button
                aria-label={`Next ${title} products`}
                className={`product-section__arrow products-next-${categorySlug}`}
                type="button"
              >
                <FaChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>

          {loading && (
            <div aria-label={`Loading ${title}`} className="product-grid-loading">
              {Array.from({ length: 4 }, (_, index) => (
                <div className="product-card-skeleton" key={index} />
              ))}
            </div>
          )}

          {error && <p className="product-section__error" role="alert">{error}</p>}

          {!loading && !error && products.length === 0 && (
            <p className="product-section__empty">No products found in this category.</p>
          )}

          {!loading && !error && products.length > 0 && (
            <Swiper
              aria-label={`${title} products`}
              breakpoints={{
                0: { slidesPerView: 1.2, spaceBetween: 14 },
                480: { slidesPerView: 2, spaceBetween: 16 },
                760: { slidesPerView: 2, spaceBetween: 18 },
                1050: { slidesPerView: 3, spaceBetween: 20 },
              }}
              modules={[Navigation]}
              navigation={{
                nextEl: `.products-next-${categorySlug}`,
                prevEl: `.products-prev-${categorySlug}`,
              }}
              slidesPerView={3}
              spaceBetween={20}
              className="products-swiper"
            >
              {products.map((product) => {
                const favorite = isFavorite(product.id)

                return (
                  <SwiperSlide key={product.id}>
                    <article className="product-card">
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
                            onClick={() => addToCart(product)}
                            type="button"
                          >
                            <FaCartPlus aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="product-card__info">
                        <Link className="product-card__title" state={{ product }} to={`/products/${product.id}`}>
                          {product.title}
                        </Link>
                        <div className="product-card__meta">
                          <span className="product-card__rating">
                            <FaStar aria-hidden="true" /> {Number(product.rating || 0).toFixed(1)}
                          </span>
                          <span className="product-card__price">
                            ${(Number(product.price || 0) * (1 - Number(product.discountPercentage || 0) / 100)).toFixed(2)}
                          </span>
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
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  )
}

export default SlideProduct
