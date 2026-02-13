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
import { LoadingProvider, useLoading } from './context/LoadingContext'
import Spinner from './components/UI/Spinner/Spinner'

function AppContent() {
  const { isLoading } = useLoading()
  
  return (
    <>
      {isLoading && <Spinner />}
      <Routes>
        <Route path = '/login' element={<Login/>}></Route>
        <Route path = '/sign-up' element={<SignUp/>}></Route>
        
        <Route path = '*' element={
          <>
            <NavBar/>
            <Routes>
              <Route path = '/home' element={<Home/>}></Route>
              <Route path = '/' element={<Navigate to="/login"/>}></Route>
              <Route path = '/product/:id' element = {<ProductDetails/>}></Route>
              <Route path = '/profile' element = {<Profile/>}></Route>
              <Route path = '/add-product' element = {<AddProduct/>}></Route>
              <Route path = '*' element={<Navigate to="/login"/>}></Route>
            </Routes>
          </>
        }></Route>
      </Routes>
      <ToastContainer position="top-left" autoClose={3000} rtl={true} />
    </>
  )
}

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LoadingProvider>
  )
}

export default App
