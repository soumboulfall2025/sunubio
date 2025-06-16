import React from 'react'
import Title from '../components/Title'
import assets from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={"À PROPOS"} text2={"DE NOUS"} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.images.logo} alt="Logo Sunu Bio & Co" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            Sunu Bio & Co est une boutique en ligne proposant une large gamme de produits, allant des produits bio, naturels et bien-être aux articles technologiques et accessoires tendance. Notre objectif est de répondre à tous vos besoins, avec qualité et confiance.
          </p>
          <p>
            Nous sélectionnons avec soin des produits certifiés, efficaces et respectueux de l’environnement, qu’ils soient cosmétiques, compléments alimentaires, équipements tech, ou accessoires du quotidien.
          </p>
          <b className='text-gray-800'>Notre mission</b>
          <p>
            Offrir à chacun un accès simple, sécurisé et complet à une diversité de produits pour améliorer votre quotidien, votre bien-être et votre style de vie, tout en soutenant une consommation responsable.
          </p>
        </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={"POURQUOI"} text2={"NOUS CHOISIR"} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Qualité garantie</b>
          <p className='text-gray-600'>
            Tous nos produits sont rigoureusement sélectionnés, testés et certifiés pour leur qualité, leur traçabilité et leur respect des normes, qu’ils soient bio ou technologiques.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Facilité & Confiance</b>
          <p className='text-gray-600'>
            Commandez en toute simplicité : livraison rapide, paiement sécurisé, service client à l’écoute, et retours faciles pour une expérience sans souci.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Service client engagé</b>
          <p className='text-gray-600'>
            Notre équipe est disponible, réactive et passionnée pour vous conseiller avant, pendant et après votre achat, quel que soit le produit choisi.
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About
