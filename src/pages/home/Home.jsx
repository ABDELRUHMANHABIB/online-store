import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import HeroSlider from '../../components/HeroSlider.jsx'
import SlideProduct from '../../components/products/SlideProduct.jsx'
import './Home.css'

function Home() {
  const location = useLocation()

  useEffect(() => {
    const targetId = decodeURIComponent(location.hash.slice(1))
    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [location.hash])

  return (
    <div className="home-page">
      <HeroSlider />
      <SlideProduct title="smartphones" />
      <SlideProduct title="mobile accessories" />
      <SlideProduct title="laptops" />
      <SlideProduct title="tablets" />
      <SlideProduct title="sunglasses" />
      <SlideProduct title="sports accessories" />
    </div>
  )
}

export default Home
