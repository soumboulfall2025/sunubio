import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



// Initialise la connexion Socket.IO (remplace par l'URL de ton backend)
const socket = io("http://localhost:4000", {
  reconnectionAttempts: 5, // Nombre de tentatives de reconnexion
  reconnectionDelay: 1000, // Délai entre les tentatives de reconnexion
});

const AdminNotifier = () => {
  useEffect(() => {
    // Envoie un event pour s'identifier comme admin (optionnel selon ton backend)
    socket.emit("register-admin");

    // Écoute l'événement order-notification
    socket.on("order-notification", (data) => {
      toast.success(
        `🛒 Nouvelle commande de ${data.nomClient} (${data.total}€)`,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
        }
      );
    });

    // Cleanup au démontage
    return () => {
      socket.off("order-notification");
      socket.disconnect();
    };
  }, []);

  return null; // Ce composant n'affiche rien à l'écran
};

export default AdminNotifier;
