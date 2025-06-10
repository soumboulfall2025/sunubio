import React from 'react'
import assets from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
        <div>
            <img src={assets.icons.arrowsRotate} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Échange facile</p>
            <p className='text-gray-400'>Échange sans tracas pour tous nos produits bio.</p>
        </div>
        <div>
            <img src={assets.icons.retour} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Retour sous 7 jours</p>
            <p className='text-gray-400'>Politique de retour simple et rapide sous 7 jours.</p>
        </div>
        <div>
            <img src={assets.icons.support} className='w-12 m-auto mb-5' alt="" />
            <p className='font-semibold'>Support client engagé</p>
            <p className='text-gray-400'>Une équipe à votre écoute pour le bien-être et le bio.</p>
        </div>
    </div>
  )
}

export default OurPolicy