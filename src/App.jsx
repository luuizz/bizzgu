import React, { useState } from 'react'
import GlobalStyle from './styles/Global'
import { Header } from './components/Header'
import { NavBar } from './components/NavBar'
import { ItemList } from './components/ItemList'

function App() {

  return (
    <>
      <GlobalStyle />
      <Header />
      <NavBar />
      <ItemList />
    </>
  )
}

export default App
