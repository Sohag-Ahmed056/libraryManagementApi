import mongoose from "mongoose"
import dotenv from "dotenv"
import app from "./app"

// Load environment variables
dotenv.config()

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/library-management"
    await mongoose.connect(mongoUri)
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

// Server configuration
const PORT = process.env.PORT || 5000

// Start server
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB()

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
     
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error("Unhandled Promise Rejection:", err.message)
  process.exit(1)
})

// Handle uncaught exceptions
process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err.message)
  process.exit(1)
})

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...")
  await mongoose.connection.close()
  process.exit(0)
})

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...")
  await mongoose.connection.close()
  process.exit(0)
})

// Start the server
startServer()
