import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://sunubio-backend.onrender.com";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/reset-password`, { token, password });
      if (res.data.success) {
        toast.success("Mot de passe réinitialisé !");
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation.");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">Réinitialiser mon mot de passe</h2>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border px-3 py-2 rounded"
        minLength={8}
        required
      />
      <button
        type="submit"
        className="bg-black text-white py-2 rounded"
        disabled={loading}
      >
        {loading ? "Envoi..." : "Réinitialiser"}
      </button>
    </form>
  );
};

export default ResetPassword;