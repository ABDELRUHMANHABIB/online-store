import { useEffect } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'

const PAGE_METADATA = {
  '/': {
    title: 'Abdelrahman Online Store | Everyday finds, made simple',
    description: 'Discover everyday technology, accessories, and useful finds at Abdelrahman Online Store.',
  },
  '/about': {
    title: 'About us | Abdelrahman Online Store',
    description: 'Learn more about Abdelrahman Online Store and the products we bring together.',
  },
  '/accessories': {
    title: 'Accessories | Abdelrahman Online Store',
    description: 'Shop useful mobile and sports accessories for everyday life.',
  },
  '/contact': {
    title: 'Contact us | Abdelrahman Online Store',
    description: 'Get in touch with Abdelrahman Online Store about products and shopping.',
  },
  '/cart': {
    title: 'Your cart | Abdelrahman Online Store',
    description: 'Review the products in your shopping cart.',
    noIndex: true,
  },
  '/favorites': {
    title: 'Your favorites | Abdelrahman Online Store',
    description: 'View the products you have saved for later.',
    noIndex: true,
  },
}

function updateMeta(attribute, key, value) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.append(element)
  }
  element.setAttribute('content', value)
}

function PageMetadata() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const searchQuery = searchParams.get('q')?.trim()
    const categorySlug = pathname.startsWith('/category/') ? pathname.split('/')[2] : ''
    const categoryName = categorySlug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    const metadata = pathname === '/search'
      ? {
          title: searchQuery ? `Search results for ${searchQuery} | Abdelrahman Online Store` : 'Search products | Abdelrahman Online Store',
          description: searchQuery ? `Browse products matching ${searchQuery} at Abdelrahman Online Store.` : 'Search products at Abdelrahman Online Store.',
          noIndex: true,
        }
      : categorySlug
        ? {
            title: `${categoryName} | Abdelrahman Online Store`,
            description: `Browse ${categoryName.toLowerCase()} at Abdelrahman Online Store.`,
          }
        : PAGE_METADATA[pathname] || PAGE_METADATA['/']

    document.title = metadata.title
    updateMeta('name', 'description', metadata.description)
    updateMeta('property', 'og:title', metadata.title)
    updateMeta('property', 'og:description', metadata.description)
    updateMeta('property', 'og:url', window.location.href)
    updateMeta('name', 'robots', metadata.noIndex ? 'noindex, follow' : 'index, follow')

    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }
    canonical.href = `${window.location.origin}${pathname}`
  }, [pathname, searchParams])

  return null
}

export default PageMetadata
