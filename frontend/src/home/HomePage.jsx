import React from 'react'
import Navbar from '../components/Navbar'
import Hero from "./Hero"
import ImageSlider from './ImageSlider'
import FAQSection from './FAQSection'
import Footer from './Footer'
const HomePage = () => {
  return (
     <div className="bg-bg text-text min-h-screen">
          <Navbar />
          <Hero />
          <ImageSlider/>
          <FAQSection />
          <Footer />
        </div>
  )
}

export default HomePage
