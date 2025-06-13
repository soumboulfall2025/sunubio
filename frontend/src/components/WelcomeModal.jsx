import React, { useEffect } from "react";

const WelcomeModal = ({ show, onClose }) => {
  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg text-center relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-700 text-xl"
          aria-label="Fermer"
        >&times;</button>
        <div className="text-3xl mb-2">🎉 Bienvenue sur <b>Sunu Bio & Co</b> ! 🌿</div>
        <div className="mb-4 text-gray-700">
          Pour profiter pleinement de nos produits bio et naturels, créez votre compte dès maintenant !
        </div>
        <div className="text-left mb-4">
          <b>🔐 Pourquoi s’inscrire ?</b>
          <ul className="list-disc ml-6 mt-2 text-sm">
            <li>Accédez à notre boutique complète</li>
            <li>Suivez facilement vos commandes</li>
            <li>Recevez des offres exclusives et promotions</li>
          </ul>
        </div>
        <div className="mb-4">
          👉 <b>Inscription rapide et gratuite !</b><br />
          Une fois inscrit(e), vous pouvez commencer vos achats en toute simplicité.
        </div>
        <div className="mb-2">
          🛒 <b>Inscrivez-vous maintenant et commencez votre expérience bien-être avec Sunu Bio & Co.</b>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition"
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;