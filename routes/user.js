const express = require("express")
const multer = require("multer")
const path = require("path")
const User = require("../models/User")
const Book = require("../models/Book")
const Article = require("../models/Article")
const Transaction = require("../models/Transaction")
const { requireAuth } = require("../middleware/auth")
const router = express.Router()

// Multer configuration for user profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users/")
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
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
})

// User dashboard
router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id

    // Get user statistics
    const userBooks = await Book.find({ seller: userId })
    const userArticles = await Article.find({ author: userId })
    const userTransactions = await Transaction.find({ buyer: userId })

    // Calculate statistics
    const totalBooksListed = userBooks.length
    const totalBooksSold = userBooks.filter((book) => book.status === "sold").length
    const totalArticles = userArticles.length
    const totalPurchases = userTransactions.length
    const totalRevenue = userBooks.filter((book) => book.status === "sold").reduce((sum, book) => sum + book.price, 0)

    // Get recent activities
    const recentBooks = await Book.find({ seller: userId }).sort({ createdAt: -1 }).limit(5)

    const recentArticles = await Article.find({ author: userId }).sort({ createdAt: -1 }).limit(5)

    const recentTransactions = await Transaction.find({ buyer: userId })
      .populate("items.book", "title images")
      .sort({ createdAt: -1 })
      .limit(5)

    res.render("user/dashboard", {
      user: req.session.user,
      stats: {
        totalBooksListed,
        totalBooksSold,
        totalArticles,
        totalPurchases,
        totalRevenue,
      },
      recentBooks,
      recentArticles,
      recentTransactions,
    })
  } catch (error) {
    console.error(error)
    res.render("user/dashboard", {
      user: req.session.user,
      stats: {
        totalBooksListed: 0,
        totalBooksSold: 0,
        totalArticles: 0,
        totalPurchases: 0,
        totalRevenue: 0,
      },
      recentBooks: [],
      recentArticles: [],
      recentTransactions: [],
    })
  }
})

// User profile
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id)
    res.render("user/profile", { user, currentUser: req.session.user })
  } catch (error) {
    console.error(error)
    res.redirect("/user/dashboard")
  }
})

// Update profile
router.post("/profile", requireAuth, upload.single("profileImage"), async (req, res) => {
  try {
    const { fullName, email, phone, address } = req.body
    const updateData = { fullName, email, phone, address }

    if (req.file) {
      updateData.profileImage = req.file.filename
    }

    await User.findByIdAndUpdate(req.session.user.id, updateData)

    // Update session data
    req.session.user.fullName = fullName
    req.session.user.email = email

    res.redirect("/user/profile?success=profile-updated")
  } catch (error) {
    console.error(error)
    res.redirect("/user/profile?error=update-failed")
  }
})

// My books
router.get("/books", requireAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 12
    const skip = (page - 1) * limit

    const books = await Book.find({ seller: req.session.user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const totalBooks = await Book.countDocuments({ seller: req.session.user.id })
    const totalPages = Math.ceil(totalBooks / limit)

    res.render("user/books", {
      user: req.session.user,
      books,
      currentPage: page,
      totalPages,
    })
  } catch (error) {
    console.error(error)
    res.render("user/books", {
      user: req.session.user,
      books: [],
      currentPage: 1,
      totalPages: 1,
    })
  }
})

// Edit book
router.get("/books/:id/edit", requireAuth, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, seller: req.session.user.id })

    if (!book) {
      return res.status(404).render("error", {
        message: "Book not found or access denied",
        user: req.session.user,
      })
    }

    res.render("user/edit-book", { user: req.session.user, book, error: null })
  } catch (error) {
    console.error(error)
    res.redirect("/user/books")
  }
})

// Update book
router.post("/books/:id/edit", requireAuth, upload.array("images", 5), async (req, res) => {
  try {
    const { title, author, isbn, category, condition, price, originalPrice, description, stock } = req.body

    const updateData = {
      title,
      author,
      isbn,
      category,
      condition,
      price: Number.parseFloat(price),
      originalPrice: originalPrice ? Number.parseFloat(originalPrice) : null,
      description,
      stock: Number.parseInt(stock) || 1,
      updatedAt: new Date(),
    }

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map((file) => file.filename)
    }

    await Book.findOneAndUpdate({ _id: req.params.id, seller: req.session.user.id }, updateData)

    res.redirect("/user/books?success=book-updated")
  } catch (error) {
    console.error(error)
    res.redirect(`/user/books/${req.params.id}/edit?error=update-failed`)
  }
})

// Delete book
router.post("/books/:id/delete", requireAuth, async (req, res) => {
  try {
    await Book.findOneAndDelete({ _id: req.params.id, seller: req.session.user.id })
    res.json({ success: true, message: "Book deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to delete book" })
  }
})

// My articles
router.get("/articles", requireAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const articles = await Article.find({ author: req.session.user.id }).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const totalArticles = await Article.countDocuments({ author: req.session.user.id })
    const totalPages = Math.ceil(totalArticles / limit)

    res.render("user/articles", {
      user: req.session.user,
      articles,
      currentPage: page,
      totalPages,
    })
  } catch (error) {
    console.error(error)
    res.render("user/articles", {
      user: req.session.user,
      articles: [],
      currentPage: 1,
      totalPages: 1,
    })
  }
})

module.exports = router
