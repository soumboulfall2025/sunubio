import express from "express"
import { loginUser, registerUser, adminLogin, getUserProfile } from "../controllers/userController.js"
import authUser from "../middlewares/authUser.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/admin", adminLogin)

// Nouvelle route pour récupérer le profil utilisateur connecté
userRouter.get("/me", authUser, getUserProfile)

export default userRouter