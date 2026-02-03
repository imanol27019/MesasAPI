import { Router } from "express"
import { getMesas, getMesaById, addNewMesa, updateMesa, deleteMesa, getMesaStats } from "../controllers/MesaController"
import { authMiddleware } from "../middlewares/authMiddleware"

const MesaRouter = Router()

// All routes protected
MesaRouter.use(authMiddleware)

MesaRouter.get("/", getMesas)
MesaRouter.get("/stats", getMesaStats)
MesaRouter.get("/:id", getMesaById)

MesaRouter.post("/", addNewMesa)
MesaRouter.patch("/:id", updateMesa)
MesaRouter.delete("/:id", deleteMesa)

export { MesaRouter }
