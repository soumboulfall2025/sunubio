import React from 'react'
import { assets } from "../assets/assets"

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between bg-white shadow'>
      <img className='w-36' src={assets.logo} alt="Sunu Bio & Co" />
      <button
        onClick={() => setToken("")}
        className='bg-green-700 hover:bg-green-900 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm transition'
      >
        Déconnexion
      </button>
    </div>
  )
}

export default Navbar