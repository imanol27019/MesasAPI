import { Router } from "express"
import { login, register } from "../controllers/AuthController"

const authRouter = Router()

// "host"/auth

// "host"/auth/register
authRouter.post("/register", register)

// "host"/auth/login
authRouter.post("/login", login)

export { authRouter }