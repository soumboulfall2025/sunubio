import jwt from "jsonwebtoken"

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers
        if (!token) {
            return res.status(401).json({ success: false, message: "Token manquant, veuillez vous reconnecter." })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        // ✅ Correction ici : on vérifie l'email du token
        if (token_decode.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({ success: false, message: "Non autorisé, token invalide." })
        }

        next()
    } catch (error) {
        console.error("Erreur adminAuth:", error.message)
        return res.status(401).json({ success: false, message: "Token invalide ou expiré" })
    }
}

export default adminAuth
