import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const DashboardStats = ({ token }) => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        totalUsers: 0,
        totalProducts: 0,
    });

    const fetchStats = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/order/stats", {
                headers: { token },
            });
            if (response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur lors du chargement des statistiques.");
        }
    };

    useEffect(() => {
        fetchStats();
        // eslint-disable-next-line
    }, [token]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Statistiques du tableau de bord</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
                <StatCard label="Commandes" value={stats.totalOrders} />
                <StatCard label="Revenus" value={`${stats.totalRevenue.toLocaleString()} ${currency}`} />
                <StatCard label="Clients" value={stats.totalUsers} />
                <StatCard label="Produits" value={stats.totalProducts} />
            </div>
        </div>
    );
};

const StatCard = ({ label, value }) => (
    <div className="bg-white p-5 rounded-2xl shadow-md border text-center">
        <p className="text-sm text-gray-500 mb-2">{label}</p>
        <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
    </div>
);

export default DashboardStats;