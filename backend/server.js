import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"
import "dotenv/config"
import path from "path"

import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import productRouter from "./routes/productRoute.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import siteMap from "./routes/siteMap.js"

import dotenv from "dotenv"
dotenv.config()

const app = express()
const server = http.createServer(app)

const allowedOrigins = [

  "http://localhost:3000",  // admin local
  "http://localhost:5173", // Vite par défaut
  "http://localhost:5174", // Ton port actuel
  "http://localhost:4000", // Autre port si nécessaire
  "https://sunubio-admin.onrender.com", // Admin Render
  "https://sunubio-frontend.onrender.com", // Frontend Render

]

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }
})

// Exporter l'instance io si tu veux l’utiliser ailleurs
export { io }

const port = process.env.PORT || 4000

async function main() {
  try {
    await connectDB()
    await connectCloudinary()

    app.use(express.json())

    
    const __dirname = path.resolve()

    app.use(express.static(path.join(__dirname, 'public')))


    // Middleware CORS
    app.use(cors({
      origin: allowedOrigins,
      credentials: true,
    }))

    // Routes API
    app.use("/api/user", userRouter)
    app.use("/api/product", productRouter)
    app.use("/api/cart", cartRouter)
    app.use("/api/order", orderRouter)

    app.use("/", siteMap)

    app.get("/", (req, res) => {
      res.send("API Working ✅")
    })

    // Gestion WebSocket
    let adminSocketId = null

    io.on("connection", (socket) => {
      console.log("🟢 Socket connecté :", socket.id)

      socket.on("register-admin", () => {
        adminSocketId = socket.id
        console.log("👑 Admin enregistré :", adminSocketId)
      })

      socket.on("disconnect", () => {
        if (socket.id === adminSocketId) {
          adminSocketId = null
          console.log("👑 Admin déconnecté")
        }
      })
    })

    // Lancement du serveur
    server.listen(port, () => {
      console.log("🚀 Backend + Socket.io démarré sur le port :", port)
    })
  } catch (error) {
    console.error("❌ Erreur au démarrage :", error)
  }
}

main()
