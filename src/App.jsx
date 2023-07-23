import React, { useState } from 'react'
import GlobalStyle from './styles/Global'
import { Header } from './components/Header'
import { NavBar } from './components/NavBar'

function App() {

  return (
    <>
      <GlobalStyle />
      <Header />
      <NavBar />
    </>
  )
}

export default App
