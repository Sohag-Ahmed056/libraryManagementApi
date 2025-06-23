import type { Request, Response, NextFunction } from "express"
import Borrow from "../models/Borrow"
import Book from "../models/Book"
import type { ApiResponse } from "../types/response"

export const borrowBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { book: bookId, quantity, dueDate } = req.body

    // Validate book exists and has sufficient copies
    const book = await Book.findById(bookId)
    if (!book) {
      res.status(404).json({
        success: false,
        message: "Book not found",
        error: "Book with the specified ID does not exist",
      })
      return
    }

    if (book.copies < quantity) {
      res.status(400).json({
        success: false,
        message: "Insufficient copies available",
        error: `Only ${book.copies} copies remaining`,
      })
      return
    }

    // Create borrow record (middleware will handle book update)
    const borrow = new Borrow({
      book: bookId,
      quantity,
      dueDate: new Date(dueDate),
    })

    await borrow.save()

    const response: ApiResponse = {
      success: true,
      message: "Book borrowed successfully",
      data: borrow,
    }

    res.status(201).json(response)
  } catch (error) {
    next(error)
  }
}

export const getBorrowedBooksSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      {
        $unwind: "$bookDetails",
      },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
      {
        $sort: { totalQuantity: -1 },
      },
    ])

    const response: ApiResponse = {
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    }

    res.json(response)
  } catch (error) {
    next(error)
  }
}
