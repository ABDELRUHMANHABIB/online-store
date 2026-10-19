
import { Autoplay, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import './HeroSlider.css'

import heroBanner1 from '../imgs/banner_Hero1.jpg'
import heroBanner2 from '../imgs/banner_Hero2.jpg'
import heroBanner3 from '../imgs/banner_Hero3.jpg'

const slides = [
  {
    image: heroBanner1,
    alt: 'White gaming console and controllers',
    eyebrow: 'LEVEL UP YOUR SETUP',
    title: 'Make every game unforgettable',
    description: 'Find the gear that brings your next adventure to life.',
  },
  {
    image: heroBanner2,
    alt: 'Modern white smart home speaker',
    eyebrow: 'SMARTER EVERY DAY',
    title: 'A little smarter. A lot more you.',
    description: 'Discover simple technology for a more connected home.',
  },
  {
    image: heroBanner3,
    alt: 'Portable music player and white earphones',
    eyebrow: 'YOUR MUSIC, YOUR MOMENT',
    title: 'Take your favorite sound anywhere',
    description: 'Explore everyday essentials made for life on the move.',
  },
]

function HeroSlider() {
  return (
    <section aria-label="Featured products" className="hero-section">
      <div className="container">
        <Swiper
          aria-label="Featured product offers"
          autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={0}
          className="hero-slider"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.image}>
              <article className="hero-slide">
                <img
                  alt={slide.alt}
                  className="hero-slide__image"
                  decoding="async"
                  fetchPriority={slide === slides[0] ? 'high' : 'auto'}
                  height="461"
                  loading={slide === slides[0] ? 'eager' : 'lazy'}
                  src={slide.image}
                  width="1300"
                />
                <div className="hero-slide__content">
                  <p className="hero-slide__eyebrow">{slide.eyebrow}</p>
                  <h1>{slide.title}</h1>
                  <p className="hero-slide__description">{slide.description}</p>
                  <a className="hero-slide__button" href="/accessories">Shop Now</a>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default HeroSlider
