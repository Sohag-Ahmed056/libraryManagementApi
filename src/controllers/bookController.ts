import type { Request, Response, NextFunction } from "express"
import Book from "../models/Book"
import type { ApiResponse } from "../types/response"

export const createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const book = new Book(req.body)
    await book.save()

    const response: ApiResponse = {
      success: true,
      message: "Book created successfully",
      data: book,
    }

    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
}

export const getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { filter, sortBy = "createdAt", sort = "desc", limit = "10" } = req.query

    let query = Book.find()

    // Apply genre filter
    if (filter) {
      query = query.where("genre").equals(filter)
    }

    // Apply sorting
    const sortOrder = sort === "desc" ? -1 : 1
    query = query.sort({ [sortBy as string]: sortOrder })

    // Apply limit
    query = query.limit(Number.parseInt(limit as string))

    const books = await query.exec()

    const response: ApiResponse = {
      success: true,
      message: "Books retrieved successfully",
      data: books,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export const getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookId } = req.params
    const book = await Book.findById(bookId)

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
        error: "Book with the specified ID does not exist",
      })
      return
    }

    const response: ApiResponse = {
      success: true,
      message: "Book retrieved successfully",
      data: book,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export const updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookId } = req.params
    const book = await Book.findByIdAndUpdate(bookId, req.body, { new: true, runValidators: true })

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
        error: "Book with the specified ID does not exist",
      })
      return
    }

    const response: ApiResponse = {
      success: true,
      message: "Book updated successfully",
      data: book,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}

export const deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { bookId } = req.params
    const book = await Book.findByIdAndDelete(bookId)

    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
        error: "Book with the specified ID does not exist",
      })
      return
    }

    const response: ApiResponse = {
      success: true,
      message: "Book deleted successfully",
      data: null,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}
