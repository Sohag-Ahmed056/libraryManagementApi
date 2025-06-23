import mongoose from "mongoose"
import dotenv from "dotenv"
import app from "./app"

// Load environment variables
dotenv.config()

// Database connection with connection pooling for serverless
const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("Already connected to MongoDB")
      return
    }

    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/library-management"
    await mongoose.connect(mongoUri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    throw error
  }
}

// Serverless function handler
const handler = async (req: any, res: any) => {
  try {
    await connectDB()
    return app(req, res)
  } catch (error) {
    console.error("Handler error:", error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
        console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
      })
    })
    .catch((error) => {
      console.error("Failed to start server:", error)
      process.exit(1)
    })
}

// Export for Vercel
export default handler
