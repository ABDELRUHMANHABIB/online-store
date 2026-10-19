import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { FaArrowLeft, FaCartPlus, FaStar } from 'react-icons/fa'
import { useStore } from '../../context/useStore.js'
import './ProductDetails.css'

function ProductDetails() {
  const { productId } = useParams()
  const location = useLocation()
  const cachedProduct = location.state?.product
  const cachedProductForRoute = cachedProduct?.id === Number(productId) ? cachedProduct : null
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(!cachedProductForRoute)
  const [error, setError] = useState('')
  const { addToCart } = useStore()
  const displayedProduct = product?.id === Number(productId) ? product : cachedProductForRoute

  useEffect(() => {
    if (!displayedProduct) return

    document.title = `${displayedProduct.title} | Abdelrahman Online Store`
    document.querySelector('meta[name="description"]')?.setAttribute('content', displayedProduct.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', displayedProduct.description)
  }, [displayedProduct])

  useEffect(() => {
    const controller = new AbortController()
    let hasImmediateProduct = false

    async function loadProduct() {
      if (cachedProduct?.id === Number(productId)) {
        hasImmediateProduct = true
        setProduct(cachedProduct)
        setSelectedImage(cachedProduct.images?.[0] || cachedProduct.thumbnail)
        setQuantity(1)
        setLoading(false)
      } else {
        setLoading(true)
      }
      setError('')

      try {
        const response = await fetch(
          `https://dummyjson.com/products/${encodeURIComponent(productId)}`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`Could not load product details (${response.status})`)
        }

        const data = await response.json()
        if (!data || typeof data.id !== 'number' || typeof data.title !== 'string') {
          throw new Error('The product response has an unexpected format')
        }

        setProduct(data)
        if (!hasImmediateProduct) {
          setSelectedImage(data.images?.[0] || data.thumbnail)
          setQuantity(1)
        }
      } catch (loadError) {
        if (loadError.name !== 'AbortError' && !hasImmediateProduct) {
          setError(loadError.message || 'Could not load product details')
        }
      } finally {
        if (!controller.signal.aborted && !hasImmediateProduct) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => controller.abort()
  }, [cachedProduct, productId])

  if (loading && !displayedProduct) {
    return <main className="product-detail-state">Loading product details...</main>
  }

  if (!displayedProduct) {
    return (
      <main className="product-detail-state product-detail-state--error">
        <p role="alert">{error || 'Product not found.'}</p>
        <Link to="/">Back to home</Link>
      </main>
    )
  }

  const images = displayedProduct.images?.length ? displayedProduct.images : [displayedProduct.thumbnail]
  const discountedPrice = displayedProduct.price * (1 - (displayedProduct.discountPercentage || 0) / 100)

  return (
    <main className="product-detail-page">
      <div className="container">
        <Link className="product-detail__back" to="/">
          <FaArrowLeft aria-hidden="true" /> Back to shopping
        </Link>

        <div className="product-detail">
          <div className="product-detail__gallery">
            <div className="product-detail__main-image">
              <img
                alt={displayedProduct.title}
                decoding="async"
                fetchPriority="high"
                src={selectedImage || displayedProduct.thumbnail}
              />
            </div>
            <div aria-label="Product images" className="product-detail__thumbnails">
              {images.map((image, index) => (
                <button
                  aria-label={`Show product image ${index + 1}`}
                  aria-pressed={selectedImage === image}
                  className={`product-detail__thumbnail${selectedImage === image ? ' product-detail__thumbnail--active' : ''}`}
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(image)}
                  type="button"
                >
                  <img alt="" decoding="async" loading="lazy" src={image} />
                </button>
              ))}
            </div>
          </div>

          <section aria-labelledby="product-detail-title" className="product-detail__information">
            <p className="product-detail__category">{displayedProduct.category}</p>
            <h1 id="product-detail-title">{displayedProduct.title}</h1>
            <div className="product-detail__rating">
              <FaStar aria-hidden="true" /> {Number(displayedProduct.rating || 0).toFixed(1)}
              <span>{displayedProduct.stock > 0 ? `${displayedProduct.stock} in stock` : 'Out of stock'}</span>
            </div>

            <p className="product-detail__description">{displayedProduct.description}</p>

            <div className="product-detail__price">
              <strong>${discountedPrice.toFixed(2)}</strong>
              {displayedProduct.discountPercentage > 0 && (
                <>
                  <del>${displayedProduct.price.toFixed(2)}</del>
                  <span>{Math.round(displayedProduct.discountPercentage)}% off</span>
                </>
              )}
            </div>

            <div className="product-detail__purchase">
              <div aria-label="Quantity" className="product-detail__quantity">
                <button
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  type="button"
                >
                  −
                </button>
                <span aria-live="polite">{quantity}</span>
                <button
                  aria-label="Increase quantity"
                  disabled={quantity >= displayedProduct.stock}
                  onClick={() => setQuantity((value) => Math.min(displayedProduct.stock, value + 1))}
                  type="button"
                >
                  +
                </button>
              </div>
              <button
                className="product-detail__add-button"
                disabled={displayedProduct.stock < 1}
                onClick={() => addToCart(displayedProduct, quantity)}
                type="button"
              >
                <FaCartPlus aria-hidden="true" />
                Add to cart
              </button>
            </div>

            <dl className="product-detail__specs">
              {displayedProduct.brand && (
                <div>
                  <dt>Brand</dt>
                  <dd>{displayedProduct.brand}</dd>
                </div>
              )}
              <div>
                <dt>Availability</dt>
                <dd>{displayedProduct.availabilityStatus || (displayedProduct.stock > 0 ? 'In stock' : 'Out of stock')}</dd>
              </div>
              {displayedProduct.warrantyInformation && (
                <div>
                  <dt>Warranty</dt>
                  <dd>{displayedProduct.warrantyInformation}</dd>
                </div>
              )}
              {displayedProduct.shippingInformation && (
                <div>
                  <dt>Shipping</dt>
                  <dd>{displayedProduct.shippingInformation}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>
    </main>
  )
}

export default ProductDetails
