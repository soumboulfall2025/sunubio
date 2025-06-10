import React, { useState, useEffect } from "react"
import axios from "axios"
import { backendUrl, currency } from "../App"
import { toast } from 'react-toastify'

const List = ({ token }) => {

    const [list, setList] = useState([])

    const fetchList = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/product/list", {
                headers: { token }
            })
            if (response.data.success) {
                setList(response.data.products)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    const removeProduct = async (id) => {
        try {
            const response = await axios.post(backendUrl + "/api/product/remove", { id }, { headers: { token } })
            if (response.data.success) {
                toast.success(response.data.message)
                setList(prevList => prevList.filter(product => product._id !== id))
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchList()
        // eslint-disable-next-line
    }, [token])

    return (
        <>
            <p className='mb-2 font-semibold text-lg'>Liste des produits</p>
            <div className='flex flex-col gap-2'>
                {/* En-tête du tableau */}
                <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-200 text-sm'>
                    <b>Image</b>
                    <b>Nom</b>
                    <b>Catégorie</b>
                    <b>Prix</b>
                    <b className='text-center'>Action</b>
                </div>
                {/* Liste des produits */}
                {
                    list.map((item, index) => (
                        <div key={index} className='grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-2 border text-sm'>
                            <img src={item.image[0]} alt="" className='w-12 h-12 object-cover rounded' />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>{item.price}{currency}</p>
                            <p onClick={() => removeProduct(item._id)} className='text-right md:text-center cursor-pointer text-red-600 font-bold hover:underline'>Supprimer</p>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default List