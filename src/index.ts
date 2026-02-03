import express from "express"
import { connectDb } from "./config/mongodb"
import { MesaRouter } from "./routes/MesaRouter"
import { authRouter } from "./routes/AuthRouter"
import { authMiddleware } from "./middlewares/authMiddleware"
import cors from "cors"
import { config as dotenvConfig } from "dotenv"
dotenvConfig()

const PORT = process.env.PORT

const server = express()

server.use(cors())
server.use(express.json())

server.get("/api", (req, res) => {
  res.json({ status: true })
})

server.use("/api/mesas", MesaRouter)

// AUTENTICACIÓN
server.use("/api/auth", authRouter)

server.use((req, res) => {
  res.json({ error: "No existe el recurso" })
})

server.listen(PORT, () => {
  connectDb()
  console.log(`✅ Servidor http con express en escucha por el puerto http://localhost:${PORT}`)
})