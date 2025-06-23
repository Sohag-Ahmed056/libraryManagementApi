import express from "express"
import cors from "cors"
import bookRoutes from "./routes/bookRoutes"
import borrowRoutes from "./routes/borrowRoutes"
import { errorHandler } from "./middleware/errorHandler"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/books", bookRoutes)
app.use("/api/borrow", borrowRoutes)

// Error handling middleware
app.use(errorHandler)

export default app
