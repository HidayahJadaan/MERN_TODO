import './App.css';
import Landing from "./pages/Todos/Landing"
import Signup from './pages/Forms/Signup';
import Login from './pages/Forms/Login';
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/todos' element={ <Landing /> } />
      </Routes>
    </>
  )
}

export default App;
