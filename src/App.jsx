import { Routes, Route } from 'react-router-dom'
import './App.css'
import { Navbar } from './components/Navbar'

import { Home, Refugee, Aid, About, Login } from './components/pages'

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/refugee" element={<Refugee />} />
        <Route path="/aid" element={<Aid />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  )
}

export default App
