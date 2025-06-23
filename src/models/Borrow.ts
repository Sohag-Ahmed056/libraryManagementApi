import mongoose, { type Document, Schema } from "mongoose"

export interface IBorrow extends Document {
  book: mongoose.Types.ObjectId
  quantity: number
  dueDate: Date
  createdAt: Date
  updatedAt: Date
}

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book reference is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: (value: Date) => value > new Date(),
        message: "Due date must be in the future",
      },
    },
  },
  {
    timestamps: true,
  },
)

// Pre-save middleware to validate book availability
borrowSchema.pre("save", async function (next) {
  if (this.isNew) {
    const Book = mongoose.model("Book")
    const book = await Book.findById(this.book)

    if (!book) {
      throw new Error("Book not found")
    }

    if (book.copies < this.quantity) {
      throw new Error(`Insufficient copies available. Only ${book.copies} copies remaining`)
    }

    // Update book copies and availability
    book.copies -= this.quantity
    await book.save()
  }
  next()
})

const Borrow = mongoose.model<IBorrow>("Borrow", borrowSchema)

export default Borrow
