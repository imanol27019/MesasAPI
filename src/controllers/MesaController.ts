import { Request, Response } from "express"
import { Mesa } from "../models/MesaModel"
import { mesaValidator, updateMesaValidator } from "../validators/mesaValidator"

const getMesas = async (req: Request, res: Response) => {
  try {
    const mesas = await Mesa.find().sort({ numeroMesa: 1 })
    res.json({ success: true, data: mesas })
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al obtener las mesas" })
  }
}

const getMesaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const mesa = await Mesa.findById(id)
    if (!mesa) return res.status(404).json({ success: false, error: "Mesa no encontrada" })
    res.json({ success: true, data: mesa })
  } catch (error) {
    res.status(400).json({ success: false, error: "Id inválido" })
  }
}

const addNewMesa = async (req: Request, res: Response) => {
  try {
    const { body } = req

    const parse = mesaValidator.safeParse(body)
    if (!parse.success) return res.status(400).json({ success: false, error: parse.error.format() })

    const exists = await Mesa.findOne({ numeroMesa: parse.data.numeroMesa })
    if (exists) return res.status(409).json({ success: false, error: "Ya existe una mesa con ese número" })

    const newMesa = await Mesa.create(parse.data)
    res.status(201).json({ success: true, data: newMesa })
  } catch (error) {
    const e = error as Error
    res.status(500).json({ success: false, error: e.message })
  }
}

const updateMesa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const parse = updateMesaValidator.safeParse(updates)
    if (!parse.success) return res.status(400).json({ success: false, error: parse.error.format() })

    // update ultimaActualizacion automatically
    if (Object.keys(parse.data).length > 0) parse.data.ultimaActualizacion = new Date()

    const updated = await Mesa.findByIdAndUpdate(id, parse.data, { new: true })
    if (!updated) return res.status(404).json({ success: false, error: "Mesa no encontrada" })

    res.json({ success: true, data: updated })
  } catch (error) {
    const e = error as Error
    res.status(400).json({ success: false, error: e.message })
  }
}

const deleteMesa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await Mesa.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ success: false, error: "Mesa no encontrada" })
    res.json({ success: true, data: deleted })
  } catch (error) {
    const e = error as Error
    res.status(400).json({ success: false, error: e.message })
  }
}

// Aggregation: counts by estado, avg capacidad, total pedidos pendientes
const getMesaStats = async (_req: Request, res: Response) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: "$estado",
          count: { $sum: 1 }
        }
      }
    ]

    const estados = await Mesa.aggregate(pipeline)

    const avgCapacity = await Mesa.aggregate([
      { $group: { _id: null, avgCap: { $avg: "$capacidad" }, total: { $sum: 1 } } }
    ])

    const pending = await Mesa.countDocuments({ pedidoPendiente: true })

    res.json({ success: true, data: { estados, promedioCapacidad: avgCapacity[0]?.avgCap ?? 0, totalMesas: avgCapacity[0]?.total ?? 0, pedidosPendientes: pending } })
  } catch (error) {
    const e = error as Error
    res.status(500).json({ success: false, error: e.message })
  }
}

export { getMesas, getMesaById, addNewMesa, updateMesa, deleteMesa, getMesaStats }
