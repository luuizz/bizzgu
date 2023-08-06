import React, { useRef ,useState } from 'react'
import GlobalStyle from './styles/Global'
import { Header } from './components/Header'
import { NavBar } from './components/NavBar'
import { ItemList } from './components/ItemList'
import { Slide } from './components/Slider'

function App() {


  return (
    <>
      <GlobalStyle />
      <Header />
      <NavBar />
      <Slide />
      <ItemList />
    </>
  )
}

export default App
