import { Document, Model, Schema, model } from "mongoose";

interface IUser extends Document {
  username?: string
  email: string
  password: string
}

const userSchema = new Schema<IUser>({
  username: { type: String, default: "Invitado" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, {
  versionKey: false,
  timestamps: true
})

// userSchema.index({ email: 1 })

const User: Model<IUser> = model<IUser>("User", userSchema)

export { User }


