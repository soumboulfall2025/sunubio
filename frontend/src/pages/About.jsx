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
        <img className='w-full md:max-w-[450px]' src={assets.images.logo} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>
            Sunu Bio & Co est une boutique en ligne dédiée aux produits bio, naturels et bien-être. Notre mission : vous offrir le meilleur du bio pour prendre soin de votre santé, de votre beauté et de votre environnement, tout en soutenant une consommation responsable et locale.
          </p>
          <p>
            Passionnés par le bien-être et la nature, nous sélectionnons avec soin des huiles, compléments, cosmétiques, épicerie et produits d’hygiène certifiés bio. Nous croyons à la transparence, à la qualité et à l’accessibilité pour tous.
          </p>
          <b className='text-gray-800'>Notre mission</b>
          <p>
            Offrir à chacun un accès simple et sécurisé à des produits bio, naturels et éthiques, pour améliorer le quotidien et préserver la planète.
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
            Tous nos produits sont certifiés bio, testés et sélectionnés pour leur efficacité, leur traçabilité et leur respect de l’environnement. Votre bien-être est notre priorité.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Facilité & Confiance</b>
          <p className='text-gray-600'>
            Commandez en toute simplicité : livraison rapide, paiement sécurisé, service client à l’écoute et retours faciles pour une expérience sans stress.
          </p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Service client engagé</b>
          <p className='text-gray-600'>
            Notre équipe est disponible, réactive et passionnée pour vous conseiller et vous accompagner avant, pendant et après votre achat.
          </p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About