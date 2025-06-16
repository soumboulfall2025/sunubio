import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TawkTo from './components/TawkTo'
import UserProfile from './components/UserProfile'
import ResetPassword from './pages/ResetPassword'
import WelcomeModal from './components/WelcomeModal'

// Composant pour forcer le scroll en haut à chaque changement de route
const ScrollToTop = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

const App = () => {
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    setShowWelcome(true)
  }, [])

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <WelcomeModal show={showWelcome} onClose={() => setShowWelcome(false)} />
      <ToastContainer />
      <ScrollToTop />

      <div
        className="bg-green-600 text-white text-center p-2 rounded mb-4 font-semibold shadow-md"
        role="alert"
        aria-live="polite"
      >
        🌿 Sunu Bio & Co élargit sa gamme ! Découvrez maintenant des produits bio, tech, accessoires & bien plus encore ! 🚀
      </div>

      <Navbar />
      <SearchBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>

      <Footer />
      <TawkTo />
    </div>
  )
}

export default App
