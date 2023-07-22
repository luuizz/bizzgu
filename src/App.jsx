import React, { useState } from 'react'

function App() {

  const [termos, setTermos] = useState(false);

  function handleChange({target}) {
    setTermos(target.checked)
  }

  return (
    <>

      <label htmlFor="">
        <input 
        type="checkbox" 
        value='Termos'
        checked={termos}
        onChange={handleChange}
        />
        Aceitar termos de privacidade
      </label>
      {
        termos && <p>Ele aceitou os termos de privacidade.</p>
      }
    </>
  )
}

export default App
