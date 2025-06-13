import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login')
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [referredByCode, setReferredByCode] = useState("")

  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (currentState === "Sign up") {
        const response = await axios.post(backendUrl + "/api/user/register", { name, email, password, referredByCode })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem("token", response.data.token)
        } else {
          toast.error(response.data.message)
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", { email, password })
        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem("token", response.data.token)
        }
        else {
          toast.error(response.data.message)
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  // Mot de passe oublié (affichage simple)
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    try {
      // À adapter selon ton backend
      const response = await axios.post(backendUrl + "/api/user/forgot-password", { email: forgotEmail })
      if (response.data.success) {
        toast.success("Un email de réinitialisation a été envoyé.")
        setShowForgot(false)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Erreur lors de la demande.")
    }
  }

  useEffect(() => {
    if (token) {
      navigate("/")
    }
  }, [token])

  return (
    <div>
      {showForgot ? (
        <form onSubmit={handleForgotPassword} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
          <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='prata-regular text-2xl'>Mot de passe oublié</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
          </div>
          <input
            onChange={e => setForgotEmail(e.target.value)}
            value={forgotEmail}
            type="email"
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Votre email'
            required
          />
          <button className='bg-black text-white font-light px-8 py-2 mt-4'>Envoyer</button>
          <p className='cursor-pointer text-sm mt-2' onClick={() => setShowForgot(false)}>Retour</p>
        </form>
      ) : (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
          <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='prata-regular text-3xl '>{currentState}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
          </div>
          {currentState === 'Login' ? '' : (
            <>
              <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required />
              <input onChange={e => setReferredByCode(e.target.value)} value={referredByCode} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Code de parrainage (optionnel)' />
            </>
          )}
          <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required />
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required />
          <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <p className='cursor-pointer' onClick={() => setShowForgot(true)}>Forgot your password?</p>
            {
              currentState === 'Login'
                ? <p onClick={() => setCurrentState('Sign up')} className='cursor-pointer'>Create account</p>
                : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login Here</p>
            }
          </div>
          <button className='bg-black text-white font-light px-8 py-2 mt-4 '>{currentState === 'Login' ? 'Sign In' : 'Sign up'}</button>
        </form>
      )}
    </div>
  )
}

export default Login