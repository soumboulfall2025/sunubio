import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])

  const fetchAllOrders = async () => {
    if (!token) {
      console.warn("Token manquant, annulation de la requête.")
      return
    }
    try {
      const response = await axios.post(backendUrl + "/api/order/list", {}, {
        headers: { token }
      })
      setOrders(response.data.orders || [])
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes :", error.response?.data || error.message)
      toast.error("Erreur lors de la récupération des commandes.")
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      )
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Statut mis à jour")
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || "Erreur lors de la mise à jour du statut")
    }
  }

  useEffect(() => {
    fetchAllOrders()
    // eslint-disable-next-line
  }, [token])

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Commandes</h3>
      <div>
        {
          orders.map((order, index) => (
            <div
              key={index}
              className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700'
            >
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} x {item.quantity} <span>{item.size}</span>
                      {idx < order.items.length - 1 && ', '}
                    </span>
                  ))}
                </div>
                <p className='mt-3 mb-2 font-medium'>
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div>
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state}, {order.address.country}, {order.address.zipcode}
                  </p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Articles : {order.items.length}</p>
                <p className='mt-3'>Méthode : {order.paymentMethod}</p>
                <p>Paiement : {order.payment ? "Effectué" : "En attente"}</p>
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{order.amount}{currency}</p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className='p-2 font-semibold'
              >
                <option value="Order Placed">Commande passée</option>
                <option value="Packing">Préparation</option>
                <option value="Shipped">Expédiée</option>
                <option value="Out for Delivery">En cours de livraison</option>
                <option value="Delivered">Livrée</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders