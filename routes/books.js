const express = require("express")
const multer = require("multer")
const path = require("path")
const Book = require("../models/Book")
const User = require("../models/User")
const { requireAuth } = require("../middleware/auth")
const router = express.Router()

// Multer configuration for book images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/books/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"), false)
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

// Books catalog
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, condition, sort } = req.query
    const page = Number.parseInt(req.query.page) || 1
    const limit = 12
    const skip = (page - 1) * limit

    const query = { status: "available" }

    // Search filters
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { author: { $regex: search, $options: "i" } }]
    }

    if (category && category !== "all") {
      query.category = category
    }

    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) query.price.$lte = Number.parseFloat(maxPrice)
    }

    if (condition && condition !== "all") {
      query.condition = condition
    }

    // Sort options
    let sortOption = { createdAt: -1 }
    if (sort === "price-low") sortOption = { price: 1 }
    else if (sort === "price-high") sortOption = { price: -1 }
    else if (sort === "rating") sortOption = { averageRating: -1 }

    const books = await Book.find(query)
      .populate("seller", "username fullName")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)

    const totalBooks = await Book.countDocuments(query)
    const totalPages = Math.ceil(totalBooks / limit)

    // Get categories for filter
    const categories = await Book.distinct("category")

    res.render("books/catalog", {
      user: req.session.user,
      books,
      categories,
      currentPage: page,
      totalPages,
      filters: { search, category, minPrice, maxPrice, condition, sort },
    })
  } catch (error) {
    console.error(error)
    res.render("books/catalog", {
      user: req.session.user,
      books: [],
      categories: [],
      currentPage: 1,
      totalPages: 1,
      filters: {},
    })
  }
})

// Book detail
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate("seller", "username fullName profileImage rating")
      .populate("reviews.user", "username fullName profileImage")

    if (!book) {
      return res.status(404).render("error", {
        message: "Book not found",
        user: req.session.user,
      })
    }

    // Increment views
    book.views += 1
    await book.save()

    // Get related books
    const relatedBooks = await Book.find({
      category: book.category,
      _id: { $ne: book._id },
      status: "available",
    })
      .limit(4)
      .populate("seller", "username")

    res.render("books/detail", {
      user: req.session.user,
      book,
      relatedBooks,
    })
  } catch (error) {
    console.error(error)
    res.status(500).render("error", {
      message: "Server error",
      user: req.session.user,
    })
  }
})

// Add review
router.post("/:id/review", requireAuth, async (req, res) => {
  try {
    const { rating, comment } = req.body
    const book = await Book.findById(req.params.id)

    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }

    // Check if user already reviewed
    const existingReview = book.reviews.find((review) => review.user.toString() === req.session.user.id)

    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this book" })
    }

    // Add review
    book.reviews.push({
      user: req.session.user.id,
      rating: Number.parseInt(rating),
      comment,
    })

    book.calculateAverageRating()
    await book.save()

    res.json({ success: true, message: "Review added successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Sell book page
router.get("/sell/new", requireAuth, (req, res) => {
  res.render("books/sell", { user: req.session.user, error: null })
})

// Sell book process
router.post("/sell", requireAuth, upload.array("images", 5), async (req, res) => {
  try {
    const { title, author, isbn, category, condition, price, originalPrice, description, stock } = req.body

    const images = req.files ? req.files.map((file) => file.filename) : []

    const book = new Book({
      title,
      author,
      isbn,
      category,
      condition,
      price: Number.parseFloat(price),
      originalPrice: originalPrice ? Number.parseFloat(originalPrice) : null,
      description,
      stock: Number.parseInt(stock) || 1,
      images,
      seller: req.session.user.id,
    })

    await book.save()
    res.redirect("/user/dashboard?success=book-added")
  } catch (error) {
    console.error(error)
    res.render("books/sell", {
      user: req.session.user,
      error: "Failed to add book. Please try again.",
    })
  }
})

module.exports = router
