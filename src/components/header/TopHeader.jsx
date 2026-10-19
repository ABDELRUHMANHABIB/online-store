import { FaHeart, FaSearch, FaShoppingCart } from 'react-icons/fa'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import logo from '../../imgs/Logo.webp'
import { useStore } from '../../context/useStore.js'

function TopHeader() {
  const { favoriteCount, cartCount } = useStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const currentQuery = searchParams.get('q') || ''

  function handleSearch(event) {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get('search')?.toString().trim()
    if (query) navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="top-header">
      <div className="container top-header__inner">
        <Link aria-label="Abdelrahman Online Store home" className="header-logo" to="/">
          <img alt="Abdelrahman Online Store" height="223" src={logo} width="615" />
        </Link>

        <form className="header-search" key={currentQuery} role="search" onSubmit={handleSearch}>
          <input
            aria-label="Search for products"
            defaultValue={currentQuery}
            name="search"
            placeholder="Search for products"
            type="search"
            required
          />
          <button aria-label="Search" type="submit">
            <FaSearch aria-hidden="true" />
          </button>
        </form>

        <div className="header-actions">
          <Link aria-label={`Wishlist, ${favoriteCount} items`} className="header-action" to="/favorites">
            <FaHeart aria-hidden="true" />
            <span className="header-action__count">{favoriteCount}</span>
          </Link>
          <Link aria-label={`Shopping cart, ${cartCount} items`} className="header-action" to="/cart">
            <FaShoppingCart aria-hidden="true" />
            <span className="header-action__count">{cartCount}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TopHeader
