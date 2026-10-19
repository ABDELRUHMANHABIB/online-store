import { useEffect, useMemo, useRef, useState } from 'react'
import { StoreContext } from './store-context.js'

function loadStoredState(key, isValid) {
  try {
    const storedValue = window.localStorage.getItem(key)
    if (!storedValue) return {}

    const parsedValue = JSON.parse(storedValue)
    if (!parsedValue || typeof parsedValue !== 'object' || Array.isArray(parsedValue) || !isValid(parsedValue)) {
      throw new Error(`Stored ${key} data has an unexpected format`)
    }

    return parsedValue
  } catch (error) {
    console.error(`Could not read ${key} from local storage`, error)
    return {}
  }
}

export function StoreProvider({ children }) {
  const [favorites, setFavorites] = useState(() => loadStoredState(
    'store-favorites',
    (value) => Object.values(value).every((product) => product && typeof product.id === 'number'),
  ))
  const [cart, setCart] = useState(() => loadStoredState(
    'store-cart',
    (value) => Object.values(value).every((item) => (
      item && item.product && typeof item.product.id === 'number'
      && Number.isInteger(item.quantity) && item.quantity > 0
    )),
  ))
  const [cartNotice, setCartNotice] = useState(null)
  const noticeId = useRef(0)

  useEffect(() => {
    try {
      window.localStorage.setItem('store-favorites', JSON.stringify(favorites))
      window.localStorage.setItem('store-cart', JSON.stringify(cart))
    } catch (error) {
      console.error('Could not save store data to local storage', error)
    }
  }, [cart, favorites])

  const value = useMemo(() => ({
    favorites: Object.values(favorites),
    cart,
    cartNotice,
    dismissCartNotice: () => setCartNotice(null),
    favoriteCount: Object.keys(favorites).length,
    cartCount: Object.values(cart).reduce((total, item) => total + item.quantity, 0),
    cartTotal: Object.values(cart).reduce(
      (total, item) => total + item.product.price * (1 - (item.product.discountPercentage || 0) / 100) * item.quantity,
      0,
    ),
    isFavorite: (productId) => Boolean(favorites[productId]),
    toggleFavorite: (product) => {
      setFavorites((current) => {
        const next = { ...current }
        if (next[product.id]) {
          delete next[product.id]
        } else {
          next[product.id] = product
        }
        return next
      })
    },
    removeFavorite: (productId) => {
      setFavorites((current) => {
        const next = { ...current }
        delete next[productId]
        return next
      })
    },
    addToCart: (product, quantity = 1) => {
      setCart((current) => ({
        ...current,
        [product.id]: {
          product,
          quantity: Math.min(
            (current[product.id]?.quantity || 0) + quantity,
            product.stock,
          ),
        },
      }))
      noticeId.current += 1
      setCartNotice({
        id: noticeId.current,
        message: `${product.title} added to your cart`,
      })
    },
    updateCartQuantity: (productId, quantity) => {
      setCart((current) => {
        const item = current[productId]
        if (!item) return current
        if (quantity < 1) {
          const next = { ...current }
          delete next[productId]
          return next
        }
        return { ...current, [productId]: { ...item, quantity: Math.min(quantity, item.product.stock) } }
      })
    },
    removeFromCart: (productId) => {
      setCart((current) => {
        const next = { ...current }
        delete next[productId]
        return next
      })
    },
  }), [cart, cartNotice, favorites])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
