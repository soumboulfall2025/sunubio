import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import assets from '../assets/assets'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {

    const [visible, setVisible] = useState(false)
    const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext)

    const logout = () => {
        localStorage.removeItem("token")
        setToken("")
        setCartItems({})
        navigate("/login")
    }

    return (
        <div className='flex items-center justify-between py-5 font-medium sticky top-0 z-40 bg-white shadow-sm'>
            <Link to="/"><img className='w-16 sm:w-28' src={assets.images.logo} alt="" /></Link>
            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
                <NavLink to="/" className="flex flex-col items-center gap-1">
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to="/collection" className="flex flex-col items-center gap-1">
                    <p>COLLECTION</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to="/about" className="flex flex-col items-center gap-1">
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to="/contact" className="flex flex-col items-center gap-1">
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
            </ul>
            <div className='flex items-center gap-6'>
                <img onClick={() => setShowSearch(true)} src={assets.icons.magnifyingGlass} className='w-5 cursor-pointer' alt="" />
                <div className='group relative'>
                    <img onClick={() => token ? null : navigate("/login")} src={assets.icons.user} className='w-5 cursor-pointer' alt="" />
                    {/* Dropdown */}
                    {token && <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                        <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                            <p className='cursor-pointer hover:text-black'>Mon Compte</p>
                            <p onClick={() => navigate("orders")} className='cursor-pointer hover:text-black'>Commandes</p>
                            <p onClick={logout} className='cursor-pointer hover:text-black'>Deconnexion</p>
                        </div>
                    </div>}
                </div>
                <Link to="/cart" className='relative'>
                    <img src={assets.icons.cartShopping} className='w-5 min-w-5' alt="" />
                    <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
                </Link>
                <img onClick={() => setVisible(true)} src={assets.icons.bars} className='w-5 cursor-pointer sm:hidden ' alt="" />
            </div>
            {/* sidebar Mobile menu amélioré */}
            {visible && (
                <div className="fixed inset-0 z-50">
                    {/* Fond semi-transparent */}
                    <div
                        className="absolute inset-0 bg-black bg-opacity-40"
                        onClick={() => setVisible(false)}
                    />
                    {/* Menu latéral */}
                    <div className="absolute top-0 right-0 w-4/5 max-w-xs h-full bg-white shadow-lg flex flex-col text-gray-600 transition-transform duration-300">
                        <div onClick={() => setVisible(false)} className="flex items-center gap-4 p-3 border-b">
                            <img src={assets.icons.xmark} className="w-4 rotate-180" alt="" />
                            <p>Back</p>
                        </div>
                        <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/">HOME</NavLink>
                        <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/collection">COLLECTION</NavLink>
                        <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/about">ABOUT</NavLink>
                        <NavLink onClick={() => setVisible(false)} className="py-3 pl-6 border-b" to="/contact">CONTACT</NavLink>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar