import multer from "multer"

// Configure le dossier où multer va stocker les fichiers
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    // Dossier local où les fichiers seront enregistrés
    callback(null, "uploads/")
  },
  filename: function (req, file, callback) {
    // Nom du fichier stocké (tu peux ajouter un timestamp pour éviter les collisions)
    callback(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })

export default upload
