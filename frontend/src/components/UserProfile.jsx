import { useEffect, useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Remplace par ton vrai backendUrl
    axios.get(`${process.env.REACT_APP_BACKEND_URL || "https://sunubio-backend.onrender.com"}/api/user/me`, {
      headers: { token: localStorage.getItem("token") }
    })
      .then(res => {
        if (res.data.success) setUser(res.data.user);
      });
  }, []);

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="bg-green-50 rounded-lg p-4 my-6">
      <h2 className="font-bold mb-2">🎁 Mes points fidélité</h2>
      <p>Vous avez <span className="font-bold">{user.points}</span> points.</p>
      <h2 className="font-bold mt-4 mb-2">🤝 Mon code de parrainage</h2>
      <p>Partagez ce code à vos amis : <span className="font-mono">{user.referralCode}</span></p>
      {user.referredBy && (
        <p className="mt-2 text-sm text-gray-500">Parrainé par : <span className="font-mono">{user.referredBy}</span></p>
      )}
    </div>
  );
};

export default UserProfile;