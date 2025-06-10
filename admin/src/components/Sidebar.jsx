import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2 bg-white'>
      <div className='flex flex-col gap-4 pt-[20%] text-[15px]'>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition 
            ${isActive ? 'bg-green-100 border-green-700 text-green-700 font-semibold' : ''}`
          }
          to="/add"
        >
          <img className='w-5 h-5' src={assets.add_icon} alt="" />
          <p className='hidden md:block'>Ajouter un produit</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition 
            ${isActive ? 'bg-green-100 border-green-700 text-green-700 font-semibold' : ''}`
          }
          to="/list"
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>Liste des produits</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition 
            ${isActive ? 'bg-green-100 border-green-700 text-green-700 font-semibold' : ''}`
          }
          to="/orders"
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>Commandes</p>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition 
            ${isActive ? 'bg-green-100 border-green-700 text-green-700 font-semibold' : ''}`
          }
          to="/stats"
        >
          <img className='w-5 h-5' src={assets.order_icon} alt="" />
          <p className='hidden md:block'>Statistiques</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar