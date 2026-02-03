import mongoose from "mongoose"

const connectDb = async () => {
  const URI_DB = process.env.URI_DB as string
  try {
    await mongoose.connect(URI_DB)
    console.log("✅ Conectado con éxito a mongo db")
  } catch (e) {
    console.log("❌ Error al conectarse a la base de datos")
  }
}

export { connectDb }