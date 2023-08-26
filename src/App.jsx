import React, { useRef ,useState } from 'react'
import { Router } from './Router'
import { BrowserRouter } from 'react-router-dom'
import GlobalStyle from './styles/Global'
import { Header } from './components/Header'
import { NavBar } from './components/NavBar'
import { Footer } from './components/Footer'
import { CartProvider } from './context/CartContext'

function App() {

  return (
    <BrowserRouter>
      <CartProvider>
        <GlobalStyle />
        <Header />
        <NavBar />
        <Router />
        <Footer />  
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
