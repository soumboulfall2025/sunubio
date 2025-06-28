import { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://sunubio-backend.onrender.com";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ phone: "", address: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour voir votre profil.");
      return;
    }
    axios.get(`${backendUrl}/api/user/me`, { headers: { token } })
      .then(res => {
        if (res.data.success) {
          setUser(res.data.user);
          setForm({
            phone: res.data.user.phone || "",
            address: res.data.user.address || ""
          });
        } else setError(res.data.message || "Erreur lors de la récupération du profil.");
      })
      .catch(() => setError("Erreur lors de la récupération du profil."));
  }, [success]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(`${backendUrl}/api/user/me`, form, { headers: { token } });
      if (res.data.success) {
        setSuccess("Profil mis à jour !");
        setUser(res.data.user);
        setEdit(false);
      } else {
        setError(res.data.message || "Erreur lors de la mise à jour.");
      }
    } catch {
      setError("Erreur lors de la mise à jour.");
    }
    setLoading(false);
  };

  if (error) return <div className="text-red-600 my-6">{error}</div>;
  if (!user) return <div>Chargement...</div>;

  return (
    <div className="bg-green-50 rounded-lg p-4 my-6 max-w-xl mx-auto">
      <h2 className="font-bold text-2xl mb-4">👤 Mon profil</h2>
      {success && <div className="text-green-700 mb-2">{success}</div>}
      <div className="mb-4">
        <p><b>Nom :</b> {user.name || <span className="text-gray-400">Non renseigné</span>}</p>
        <p><b>Email :</b> {user.email || <span className="text-gray-400">Non renseigné</span>}</p>
        {!edit ? (
          <>
            <p><b>Téléphone :</b> {user.phone || <span className="text-gray-400">Non renseigné</span>}</p>
            <p><b>Adresse :</b> {user.address || <span className="text-gray-400">Non renseignée</span>}</p>
            <button className="mt-2 px-4 py-1 bg-yellow-500 text-white rounded" onClick={() => setEdit(true)}>
              Modifier mes infos
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
            <label>
              Téléphone :
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="border rounded px-2 py-1 ml-2"
              />
            </label>
            <label>
              Adresse :
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="border rounded px-2 py-1 ml-2"
              />
            </label>
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded" disabled={loading}>
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button type="button" className="bg-gray-300 px-4 py-1 rounded" onClick={() => setEdit(false)}>
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
      <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mb-4">
        <h3 className="font-bold mb-1">🎉 Bonus d’inscription</h3>
        <p>Utilise le code <span className="font-mono font-bold text-green-700">WELCOME10</span> pour -10% sur ta première commande !</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold mb-1">🎁 Mes points fidélité</h3>
        <p>Vous avez <span className="font-bold">{user.points ?? 0}</span> points.</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold mb-1">🤝 Mon code de parrainage</h3>
        <p>Partagez ce code à vos amis : <span className="font-mono">{user.referralCode || 'Non attribué'}</span></p>
        {user.referredBy && (
          <p className="mt-2 text-sm text-gray-500">Parrainé par : <span className="font-mono">{user.referredBy}</span></p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;