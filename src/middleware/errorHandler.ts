import type { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500
  let message = "Internal server error"
  let errorResponse = error

  // Mongoose validation error
  if (error instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = "Validation failed"
    errorResponse = {
      name: error.name,
      errors: error.errors,
    }
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    statusCode = 400
    message = "Duplicate entry"
    const field = Object.keys(error.keyValue)[0]
    errorResponse = `${field} already exists`
  }

  // Mongoose cast error (invalid ObjectId)
  if (error instanceof mongoose.Error.CastError) {
    statusCode = 400
    message = "Invalid ID format"
    errorResponse = "Invalid ID provided"
  }

  // Custom application errors
  if (error.message) {
    if (error.message.includes("Insufficient copies") || error.message.includes("Book not found")) {
      statusCode = 400
      message = error.message
      errorResponse = error.message
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: errorResponse,
  })
}
