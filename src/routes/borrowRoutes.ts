import express from "express"
import { borrowBook, getBorrowedBooksSummary } from "../controllers/borrowController"

const router = express.Router()

router.post("/", borrowBook)
router.get("/", getBorrowedBooksSummary)

export default router
