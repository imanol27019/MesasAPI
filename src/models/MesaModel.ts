import { Document, Model, Schema, model } from "mongoose"

export interface IMesa extends Document {
  numeroMesa: number
  estado: "libre" | "ocupada" | "reservada"
  capacidad: number
  pedidoPendiente: boolean
  ultimaActualizacion: Date
}

const mesaSchema = new Schema<IMesa>(
  {
    numeroMesa: { type: Number, required: true, unique: true },
    estado: { type: String, enum: ["libre", "ocupada", "reservada"], default: "libre" },
    capacidad: { type: Number, required: true, min: 1, default: 4 },
    pedidoPendiente: { type: Boolean, default: false },
    ultimaActualizacion: { type: Date, default: Date.now }
  },
  { versionKey: false, timestamps: true }
)

const Mesa: Model<IMesa> = model<IMesa>("Mesa", mesaSchema)

export { Mesa }
