# 📚 Library Management API

A RESTful backend system for managing books and borrow operations in a library. Built using **Express**, **TypeScript**, and **MongoDB (via Mongoose)**, this API enforces business logic, supports aggregation, and follows strict schema validation for robust and scalable data handling.

---

## ✨ Features

- ✅ Full CRUD for books (create, retrieve, update, delete)
- ✅ Borrow books with validation on available copies
- ✅ Auto-update `available` status when copies reach zero
- ✅ Filter books by genre, sort, and limit result sets
- ✅ Borrowed books summary using MongoDB aggregation pipeline
- ✅ Includes Mongoose static method, instance method, and middleware (`pre`, `post`)
- ✅ Custom error handling with consistent response format
- ✅ Fully typed codebase with TypeScript

---

## 🧪 API Endpoints

### 📘 Book Endpoints

| Method | Endpoint                | Description                     |
|--------|-------------------------|---------------------------------|
| POST   | `/api/books`            | Create a new book               |
| GET    | `/api/books`            | Get all books                   |
| GET    | `/api/books/:bookId`    | Get a book by ID                |
| PUT    | `/api/books/:bookId`    | Update a book                   |
| DELETE | `/api/books/:bookId`    | Delete a book                   |

> Supports query params: `filter=GENRE`, `sortBy=FIELD`, `sort=asc|desc`, `limit=N`

### 📖 Borrow Endpoints

| Method | Endpoint     | Description                              |
|--------|--------------|------------------------------------------|
| POST   | `/api/borrow`| Borrow a book (with quantity validation) |
| GET    | `/api/borrow`| Get total borrowed quantity per book     |

---

## ⚙️ Setup Instructions (Local)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/library-management-api.git
2. Install Dependencies
bash

npm install
