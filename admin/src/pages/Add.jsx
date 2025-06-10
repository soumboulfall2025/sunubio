import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from "axios"
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {

    const [image1, setImage1] = useState(false)
    const [image2, setImage2] = useState(false)
    const [image3, setImage3] = useState(false)
    const [image4, setImage4] = useState(false)

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("Huiles")
    const [subCategory, setSubCategory] = useState("Huile végétale")
    const [bestSeller, setBestSeller] = useState(false)
    const [sizes, setSizes] = useState([])

    // Catégories et sous-catégories adaptées au bio
    const bioCategories = [
        "Huiles",
        "Compléments",
        "Cosmétiques",
        "Épicerie",
        "Hygiène",
        "Bien-être"
    ]
    const bioSousCategories = [
        "Huile végétale",
        "Gélules",
        "Savon",
        "Infusion",
        "Crème",
        "Graines"
    ]

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("category", category)
            formData.append("subCategory", subCategory)
            formData.append("bestSeller", bestSeller)
            formData.append("sizes", JSON.stringify(sizes))

            image1 && formData.append("image1", image1)
            image2 && formData.append("image2", image2)
            image3 && formData.append("image3", image3)
            image4 && formData.append("image4", image4)

            const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } })
            if (response.data.success) {
                toast.success(response.data.message)
                setName("")
                setDescription("")
                setImage1(false)
                setImage2(false)
                setImage3(false)
                setImage4(false)
                setPrice("")
                setSizes([])
                setCategory(bioCategories[0])
                setSubCategory(bioSousCategories[0])
                setBestSeller(false)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
            toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
            <div>
                <p className='mb-2'>Images du produit</p>
                <div className='flex gap-2'>
                    <label htmlFor="image1">
                        <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
                        <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
                    </label>
                    <label htmlFor="image2">
                        <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
                        <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
                    </label>
                    <label htmlFor="image3">
                        <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
                        <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
                    </label>
                    <label htmlFor="image4">
                        <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
                        <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                    </label>
                </div>
            </div>
            <div className='w-full'>
                <p className='mb-2'>Nom du produit</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Nom du produit' required />
            </div>
            <div className='w-full'>
                <p className='mb-2'>Description du produit</p>
                <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Décrivez le produit' required />
            </div>

            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8 '>
                <div>
                    <p className='mb-2'>Catégorie</p>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
                        {bioCategories.map((cat, idx) => (
                            <option key={idx} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Sous-catégorie</p>
                    <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
                        {bioSousCategories.map((sous, idx) => (
                            <option key={idx} value={sous}>{sous}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Prix</p>
                    <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='Prix en F CFA' required />
                </div>
            </div>

            <div>
                <p className='mb-2'>Tailles disponibles</p>
                <div className='flex gap-3'>
                    <div onClick={() => setSizes(prev => prev.includes("G") ? prev.filter(item => item !== "G") : [...prev, "G"])}>
                        <p className={`${sizes.includes("G") ? "bg-green-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>G</p>
                    </div>
                    <div onClick={() => setSizes(prev => prev.includes("P") ? prev.filter(item => item !== "P") : [...prev, "P"])}>
                        <p className={`${sizes.includes("P") ? "bg-green-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>P</p>
                    </div>
                </div>
            </div>
            <div className='flex gap-2 mt-2'>
                <input onChange={() => setBestSeller(prev => !prev)} checked={bestSeller} type="checkbox" id='bestSeller' />
                <label className='cursor-pointer' htmlFor="bestSeller">Mettre en avant (meilleure vente)</label>
            </div>
            <button className='w-28 py-3 mt-4 bg-green-700 hover:bg-green-900 text-white' type='submit'>AJOUTER</button>
        </form>
    )
}

export default Add