import { Link } from 'react-router-dom'
import { FaArrowLeft, FaCartPlus, FaHeart, FaMinus, FaPlus, FaShoppingCart, FaTrash } from 'react-icons/fa'
import { useStore } from '../../context/useStore.js'
import './CollectionPage.css'

function CollectionPage({ type }) {
  const isCart = type === 'cart'
  const {
    favorites,
    cart,
    cartTotal,
    addToCart,
    removeFavorite,
    removeFromCart,
    updateCartQuantity,
  } = useStore()
  const items = isCart
    ? Object.values(cart).map(({ product, quantity }) => ({ product, quantity }))
    : favorites.map((product) => ({ product, quantity: 1 }))

  return (
    <main className="collection-page">
      <div className="container">
        <Link className="collection-page__back" to="/">
          <FaArrowLeft aria-hidden="true" /> Continue shopping
        </Link>

        <header className="collection-page__heading">
          <span className="collection-page__icon">
            {isCart
              ? <FaShoppingCart aria-hidden="true" />
              : <FaHeart aria-hidden="true" />}
          </span>
          <div>
            <p>{isCart ? 'YOUR SHOPPING BAG' : 'SAVED FOR LATER'}</p>
            <h1>{isCart ? 'Your Cart' : 'Your Favorites'}</h1>
          </div>
          <span className="collection-page__count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
        </header>

        {items.length === 0 ? (
          <section className="collection-empty">
            <div className="collection-empty__icon">
              {isCart
                ? <FaShoppingCart aria-hidden="true" />
                : <FaHeart aria-hidden="true" />}
            </div>
            <h2>{isCart ? 'Your cart is empty' : 'No favorites yet'}</h2>
            <p>
              {isCart
                ? 'Add something you love and it will appear here.'
                : 'Tap the heart on a product to save it here.'}
            </p>
            <Link className="collection-empty__button" to="/">Explore products</Link>
          </section>
        ) : (
          <div className="collection-layout">
            <section aria-label={isCart ? 'Cart items' : 'Favorite products'} className="collection-items">
              {items.map(({ product, quantity }) => (
                <article className="collection-item" key={product.id}>
                  <Link className="collection-item__image" state={{ product }} to={`/products/${product.id}`}>
                    <img alt={product.title} decoding="async" loading="lazy" src={product.thumbnail} />
                  </Link>
                  <div className="collection-item__info">
                    <p className="collection-item__category">{product.category}</p>
                    <Link className="collection-item__title" state={{ product }} to={`/products/${product.id}`}>
                      {product.title}
                    </Link>
                    <span className="collection-item__unit-price">
                      ${(product.price * (1 - (product.discountPercentage || 0) / 100)).toFixed(2)} each
                    </span>
                    {!isCart && (
                      <div className="collection-item__actions">
                        <button
                          className="collection-item__text-action collection-item__text-action--cart"
                          onClick={() => addToCart(product)}
                          type="button"
                        >
                          <FaCartPlus aria-hidden="true" /> Add to cart
                        </button>
                        <button
                          className="collection-item__text-action"
                          onClick={() => removeFavorite(product.id)}
                          type="button"
                        >
                          <FaTrash aria-hidden="true" /> Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {isCart && (
                    <div aria-label={`Quantity of ${product.title}`} className="collection-item__quantity">
                      <button
                        aria-label={`Decrease ${product.title} quantity`}
                        onClick={() => updateCartQuantity(product.id, quantity - 1)}
                        type="button"
                      >
                        <FaMinus aria-hidden="true" />
                      </button>
                      <span aria-live="polite">{quantity}</span>
                      <button
                        aria-label={`Increase ${product.title} quantity`}
                        disabled={quantity >= product.stock}
                        onClick={() => updateCartQuantity(product.id, quantity + 1)}
                        type="button"
                      >
                        <FaPlus aria-hidden="true" />
                      </button>
                    </div>
                  )}

                  <strong className="collection-item__total">
                    ${(product.price * (1 - (product.discountPercentage || 0) / 100) * quantity).toFixed(2)}
                  </strong>
                  {isCart && (
                    <button
                      aria-label={`Remove ${product.title} from cart`}
                      className="collection-item__remove"
                      onClick={() => removeFromCart(product.id)}
                      type="button"
                    >
                      <FaTrash aria-hidden="true" />
                    </button>
                  )}
                  {!isCart && (
                    <Link className="collection-item__view" state={{ product }} to={`/products/${product.id}`}>
                      View
                    </Link>
                  )}
                </article>
              ))}
            </section>

            {isCart && (
              <aside aria-label="Order summary" className="cart-summary">
                <h2>Order summary</h2>
                <div className="cart-summary__row">
                  <span>Subtotal</span>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>
                <div className="cart-summary__row cart-summary__row--muted">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="cart-summary__total">
                  <span>Total</span>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>
                <Link className="cart-summary__continue" to="/">Continue shopping</Link>
                <p>Discounted prices are included in your total.</p>
              </aside>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default CollectionPage
