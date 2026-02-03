import { NextFunction, Request, Response } from "express"
import * as jwt from "jsonwebtoken"

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers

    if (!authorization) {
      return res.status(401).json({
        success: false,
        error: "Debes incluir un token en la petición"
      })
    }

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Formato de token inválido"
      })
    }

    const token = authorization.split(" ")[1]
    const secret = process.env.JWT_SECRET || "passSuperSegura"

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Token inválido o vencido"
    })
  }
}

export { authMiddleware }
