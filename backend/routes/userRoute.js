import express from "express"
import { loginUser, registerUser, adminLogin, getUserProfile, forgotPassword, resetPassword } from "../controllers/userController.js"
import authUser from "../middleware/auth.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/admin", adminLogin)

// Nouvelle route pour récupérer le profil utilisateur connecté
userRouter.get("/me", authUser, getUserProfile)

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

// Route pour mettre à jour le profil utilisateur
userRouter.patch("/me", authUser, async (req, res) => {
  try {
    const updates = {};
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    if (req.body.address !== undefined) updates.address = req.body.address;
    // Ajoute d'autres champs modifiables si besoin
    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, select: "name email phone address points referralCode referredBy" }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default userRouter