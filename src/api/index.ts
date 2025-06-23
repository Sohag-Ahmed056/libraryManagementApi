import type { Request, Response } from "express"
import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import bookRoutes from "../routes/bookRoutes"
import borrowRoutes from "../routes/borrowRoutes"
import { errorHandler } from "../middleware/errorHandler"

// Load environment variables
dotenv.config()

// Create Express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/books", bookRoutes)
app.use("/api/borrow", borrowRoutes)

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Library Management API is running",
    endpoints: {
      books: "/api/books",
      borrow: "/api/borrow",
    },
  })
})

app.get("/api", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Library Management API",
    version: "1.0.0",
    endpoints: {
      "GET /api/books": "Get all books",
      "POST /api/books": "Create a book",
      "GET /api/books/:id": "Get book by ID",
      "PUT /api/books/:id": "Update book",
      "DELETE /api/books/:id": "Delete book",
      "POST /api/borrow": "Borrow a book",
      "GET /api/borrow": "Get borrowed books summary",
    },
  })
})

// Error handling middleware
app.use(errorHandler)

// Database connection for serverless
let cachedConnection: typeof mongoose | null = null

const connectDB = async () => {
  if (cachedConnection && cachedConnection.connection.readyState === 1) {
    console.log("Using cached database connection")
    return cachedConnection
  }

  try {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    console.log("Creating new database connection")
    cachedConnection = await mongoose.connect(mongoUri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    console.log("MongoDB connected successfully")
    return cachedConnection
  } catch (error) {
    console.error("MongoDB connection error:", error)
    cachedConnection = null
    throw error
  }
}

// Serverless handler - using any types to avoid @vercel/node dependency
export default async function handler(req: any, res: any) {
  try {
    // Connect to database
    await connectDB()

    // Handle the request with Express app
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
