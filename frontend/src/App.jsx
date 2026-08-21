import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import PageLayout from './components/PageLayout.jsx'
import AboutUs from './pages/AboutUs.jsx'
import Blog from './pages/Blog.jsx'
import ContactUs from './pages/ContactUs.jsx'
import Destinations from './pages/Destinations.jsx'
import Home from './pages/Home.jsx'
import TourDetail from './pages/TourDetail.jsx'
import Tours from './pages/Tours.jsx'
import Login from './pages/auth/Login.jsx'
import Dashboard from './pages/dashboard/Dashboard.jsx'
import { getCurrentUser, isAuthenticated } from './services/authService.js'

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<PageLayout page={<Home />} />} />
        <Route path="/about-us" element={<PageLayout page={<AboutUs />} />} />
        <Route path="/blog" element={<PageLayout page={<Blog />} />} />
        <Route path="/contact-us" element={<PageLayout page={<ContactUs />} />} />
        <Route path="/destinations" element={<PageLayout page={<Destinations />} />} />
        <Route path="/tours" element={<PageLayout page={<Tours />} />} />
        <Route path="/tours/:id" element={<PageLayout page={<TourDetail />} />} />
        <Route path="/login" element={<PublicOnlyRoute page={<Login />} />} />
        <Route path="/dashboard/*" element={<ProtectedRoute page={<Dashboard />} />} />
      </Routes>
    </BrowserRouter>
  )
}

function ProtectedRoute({ page }) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return page
}

function PublicOnlyRoute({ page }) {
  if (isAuthenticated() && getCurrentUser()) {
    return <Navigate to="/dashboard" replace />
  }

  return page
}

function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      return
    }

    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [hash, pathname])

  return null
}

export default App
