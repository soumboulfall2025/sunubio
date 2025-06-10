import React from 'react'
import assets from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <h1 className='mb-5 w-32'><img className='w-36' src={assets.images.logo} alt="" /></h1>
                <p className='w-full md:w-2/3 text-gray-600'>
                    Sunu Bio & Co est une boutique en ligne dédiée aux produits bio, naturels et bien-être. Nous sélectionnons pour vous des huiles, compléments, cosmétiques, épicerie et produits d’hygiène certifiés bio, pour prendre soin de votre santé et de la planète.
                    <br />
                </p>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>BOUTIQUE</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Accueil</li>
                    <li>À propos</li>
                    <li>Livraison</li>
                    <li>Politique de confidentialité</li>
                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>CONTACT</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>+221 78 720 39 75</li>
                    <li>contact@sunubio.com</li>
                    <li>Gueule Tapée, rue 67, Dakar</li>
                </ul>
            </div>

        </div>
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025 © Sunu Bio & Co - Tous droits réservés.</p>
        </div>
    </div>
  )
}

export default Footer