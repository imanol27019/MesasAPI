import { z } from "zod"

export const mesaValidator = z.object({
  numeroMesa: z.number().int().positive(),
  estado: z.enum(["libre", "ocupada", "reservada"]).optional(),
  capacidad: z.number().int().min(1).optional(),
  pedidoPendiente: z.boolean().optional(),
  ultimaActualizacion: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) return new Date(arg as any)
    return undefined
  }, z.date().optional())
})

export const updateMesaValidator = mesaValidator.partial()

export type MesaInput = z.infer<typeof mesaValidator>
