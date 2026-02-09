import { Navigate, Route, BrowserRouter, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import NavBar from './components/Layout/NavBar/NavBar'
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUp/SignUp'
import Home from './Pages/Home/Home'
import ProductDetails from './Pages/ProductDetails/ProductDetails'
import Profile from './Pages/Profile/Profile'
import AddProduct from './Pages/AddProduct/AddProduct'

function App() {

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
        <Route path = '/login' element={<Login/>}></Route>
        <Route path = '/sign-up' element={<SignUp/>}></Route>

        <Route path = '/home' element={<Home/>}></Route>
        <Route path = '/' element={<Navigate to="/home"/>}></Route>

        <Route path = '/product/:id' element = {<ProductDetails/>}></Route>

        <Route path = '/profile' element = {<Profile/>}></Route>

        <Route path = '/add-product' element = {<AddProduct/>}></Route>

        <Route path = '*' element={<Navigate to="/login"/>}></Route>
      </Routes>
      <ToastContainer position="top-left" autoClose={3000} rtl={true} />
    </BrowserRouter>
  )
}

export default App
