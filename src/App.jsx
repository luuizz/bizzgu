import React, { useRef ,useState } from 'react'
import { Router } from './Router'
import { BrowserRouter } from 'react-router-dom'
import GlobalStyle from './styles/Global'
import { Header } from './components/Header'
import { NavBar } from './components/NavBar'

function App() {

  return (
    <BrowserRouter>
      <GlobalStyle />
      <Header />
      <NavBar />
      <Router />
    </BrowserRouter>
  )
}

export default App
