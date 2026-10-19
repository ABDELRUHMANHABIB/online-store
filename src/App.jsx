
import TopHeader from './components/header/TopHeader.jsx'
import BtmHeader from './components/header/BtmHeader.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/home/Home.jsx'
import ProductDetails from './pages/products/ProductDetails.jsx'
import CollectionPage from './pages/collection/CollectionPage.jsx'
import { AboutPage, AccessoriesPage, ContactPage } from './pages/static/StaticPages.jsx'
import StoreToast from './components/StoreToast.jsx'
import ProductResultsPage from './pages/products/ProductResultsPage.jsx'
import Footer from './components/Footer.jsx'
import PageMetadata from './components/PageMetadata.jsx'

import './components/header/header.css'

function App() {
  return (
    <>
      <header className="site-header">
        <TopHeader />
        <BtmHeader />
      </header>
      <PageMetadata />
      <StoreToast />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/search" element={<ProductResultsPage mode="search" />} />
        <Route path="/category/:categorySlug" element={<ProductResultsPage mode="category" />} />
        <Route path="/favorites" element={<CollectionPage type="favorites" />} />
        <Route path="/cart" element={<CollectionPage type="cart" />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/accessories" element={<AccessoriesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
