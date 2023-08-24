import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registrations from './components/Registrations';
import Dashboard from './components/Dashboard';
import FourZeroFour from './components/FourZeroFour';
function App() {
  const AuthToken = localStorage.getItem("AuthToken")
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registrations />} />
   
        <Route path='/dashboard' element={<Dashboard />} />
     
       <Route path='*' element={<FourZeroFour />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
