const express = require("express")
const User = require("../models/User")
const Book = require("../models/Book")
const Article = require("../models/Article")
const Transaction = require("../models/Transaction")
const PromoCode = require("../models/PromoCode")
const { requireAuth, requireAdmin } = require("../middleware/auth")
const router = express.Router()

// Admin dashboard
router.get("/dashboard", requireAuth, requireAdmin, async (req, res) => {
  try {
    // Get statistics
    const totalUsers = await User.countDocuments({ role: "user" })
    const totalBooks = await Book.countDocuments()
    const totalArticles = await Article.countDocuments()
    const totalTransactions = await Transaction.countDocuments()
    const totalRevenue = await Transaction.aggregate([{ $group: { _id: null, total: { $sum: "$finalAmount" } } }])

    // Get recent activities
    const recentUsers = await User.find({ role: "user" }).sort({ joinDate: -1 }).limit(5)

    const recentBooks = await Book.find().populate("seller", "username fullName").sort({ createdAt: -1 }).limit(5)

    const recentTransactions = await Transaction.find()
      .populate("buyer", "username fullName")
      .sort({ createdAt: -1 })
      .limit(5)

    // Monthly statistics for charts
    const monthlyStats = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$finalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ])

    res.render("admin/dashboard", {
      user: req.session.user,
      stats: {
        totalUsers,
        totalBooks,
        totalArticles,
        totalTransactions,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      recentUsers,
      recentBooks,
      recentTransactions,
      monthlyStats,
    })
  } catch (error) {
    console.error(error)
    res.render("admin/dashboard", {
      user: req.session.user,
      stats: {
        totalUsers: 0,
        totalBooks: 0,
        totalArticles: 0,
        totalTransactions: 0,
        totalRevenue: 0,
      },
      recentUsers: [],
      recentBooks: [],
      recentTransactions: [],
      monthlyStats: [],
    })
  }
})

// Manage users
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 20
    const skip = (page - 1) * limit
    const search = req.query.search || ""

    const query = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { fullName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {}

    const users = await User.find(query).sort({ joinDate: -1 }).skip(skip).limit(limit)

    const totalUsers = await User.countDocuments(query)
    const totalPages = Math.ceil(totalUsers / limit)

    res.render("admin/users", {
      user: req.session.user,
      users,
      currentPage: page,
      totalPages,
      search,
    })
  } catch (error) {
    console.error(error)
    res.render("admin/users", {
      user: req.session.user,
      users: [],
      currentPage: 1,
      totalPages: 1,
      search: "",
    })
  }
})

// Toggle user status
router.post("/users/:id/toggle-status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    user.isActive = !user.isActive
    await user.save()

    res.json({ success: true, isActive: user.isActive })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Manage books
router.get("/books", requireAuth, requireAdmin, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 20
    const skip = (page - 1) * limit
    const search = req.query.search || ""

    const query = search
      ? {
          $or: [{ title: { $regex: search, $options: "i" } }, { author: { $regex: search, $options: "i" } }],
        }
      : {}

    const books = await Book.find(query)
      .populate("seller", "username fullName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalBooks = await Book.countDocuments(query)
    const totalPages = Math.ceil(totalBooks / limit)

    res.render("admin/books", {
      user: req.session.user,
      books,
      currentPage: page,
      totalPages,
      search,
    })
  } catch (error) {
    console.error(error)
    res.render("admin/books", {
      user: req.session.user,
      books: [],
      currentPage: 1,
      totalPages: 1,
      search: "",
    })
  }
})

// Delete book
router.post("/books/:id/delete", requireAuth, requireAdmin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: "Book deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to delete book" })
  }
})

// Manage transactions
router.get("/transactions", requireAuth, requireAdmin, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 20
    const skip = (page - 1) * limit
    const status = req.query.status || ""

    const query = status ? { status } : {}

    const transactions = await Transaction.find(query)
      .populate("buyer", "username fullName")
      .populate("items.book", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalTransactions = await Transaction.countDocuments(query)
    const totalPages = Math.ceil(totalTransactions / limit)

    res.render("admin/transactions", {
      user: req.session.user,
      transactions,
      currentPage: page,
      totalPages,
      selectedStatus: status,
    })
  } catch (error) {
    console.error(error)
    res.render("admin/transactions", {
      user: req.session.user,
      transactions: [],
      currentPage: 1,
      totalPages: 1,
      selectedStatus: "",
    })
  }
})

// Update transaction status
router.post("/transactions/:id/status", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    await Transaction.findByIdAndUpdate(req.params.id, {
      status,
      updatedAt: new Date(),
    })
    res.json({ success: true, message: "Transaction status updated" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to update status" })
  }
})

// Manage promo codes
router.get("/promo-codes", requireAuth, requireAdmin, async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().populate("createdBy", "username").sort({ createdAt: -1 })

    res.render("admin/promo-codes", {
      user: req.session.user,
      promoCodes,
    })
  } catch (error) {
    console.error(error)
    res.render("admin/promo-codes", {
      user: req.session.user,
      promoCodes: [],
    })
  }
})

// Create promo code
router.post("/promo-codes", requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      usageLimit,
      validFrom,
      validUntil,
    } = req.body

    const promoCode = new PromoCode({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue: Number.parseFloat(discountValue),
      minPurchase: Number.parseFloat(minPurchase) || 0,
      maxDiscount: maxDiscount ? Number.parseFloat(maxDiscount) : null,
      usageLimit: Number.parseInt(usageLimit) || 1,
      validFrom: new Date(validFrom),
      validUntil: new Date(validUntil),
      createdBy: req.session.user.id,
    })

    await promoCode.save()
    res.redirect("/admin/promo-codes?success=promo-created")
  } catch (error) {
    console.error(error)
    res.redirect("/admin/promo-codes?error=creation-failed")
  }
})

// Toggle promo code status
router.post("/promo-codes/:id/toggle", requireAuth, requireAdmin, async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id)
    promoCode.isActive = !promoCode.isActive
    await promoCode.save()
    res.json({ success: true, isActive: promoCode.isActive })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
