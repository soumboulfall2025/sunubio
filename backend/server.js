import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import "dotenv/config";
import path from "path";

import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import siteMap from "./routes/siteMap.js";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4000",
  "https://sunubio-admin.onrender.com",
  "https://sunubio-frontend.onrender.com",
  "https://www.sunuexpressshop.com",
  "https://sunuexpressshop.com",
];

// Configuration CORS HTTP (Express)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Origin bloqué par CORS :", origin);
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

// WebSocket config
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }
});
export { io };

// Middlewares globaux
app.use(express.json());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/", siteMap);

// Test route
app.get("/", (req, res) => {
  res.send("✅ API Running");
});

// WebSocket logic
let adminSocketId = null;

io.on("connection", (socket) => {
  console.log("🟢 Nouvelle connexion socket :", socket.id);

  socket.on("register-admin", () => {
    adminSocketId = socket.id;
    console.log("👑 Admin connecté :", adminSocketId);
  });

  socket.on("disconnect", () => {
    if (socket.id === adminSocketId) {
      adminSocketId = null;
      console.log("👑 Admin déconnecté");
    }
  });
});

// Démarrage du serveur
async function main() {
  try {
    await connectDB();
    await connectCloudinary();

    server.listen(port, () => {
      console.log("🚀 Serveur démarré sur le port", port);
    });
  } catch (error) {
    console.error("❌ Erreur au lancement :", error);
  }
}

main();
