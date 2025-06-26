const express = require("express")
const Book = require("../models/Book")
const { requireAuth } = require("../middleware/auth")
const router = express.Router()

// Get cart
router.get("/", requireAuth, (req, res) => {
  const cart = req.session.cart || []
  res.render("cart/index", { user: req.session.user, cart })
})

// Add to cart
router.post("/add", requireAuth, async (req, res) => {
  try {
    const { bookId, quantity = 1 } = req.body
    const book = await Book.findById(bookId).populate("seller", "username")

    if (!book || book.status !== "available") {
      return res.status(404).json({ error: "Book not available" })
    }

    if (!req.session.cart) {
      req.session.cart = []
    }

    // Check if book already in cart
    const existingItem = req.session.cart.find((item) => item.bookId === bookId)

    if (existingItem) {
      existingItem.quantity += Number.parseInt(quantity)
    } else {
      req.session.cart.push({
        bookId,
        title: book.title,
        author: book.author,
        price: book.price,
        image: book.images[0] || null,
        seller: book.seller.username,
        quantity: Number.parseInt(quantity),
      })
    }

    res.json({ success: true, message: "Book added to cart" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Update cart item
router.post("/update", requireAuth, (req, res) => {
  try {
    const { bookId, quantity } = req.body

    if (!req.session.cart) {
      return res.status(404).json({ error: "Cart is empty" })
    }

    const item = req.session.cart.find((item) => item.bookId === bookId)
    if (item) {
      item.quantity = Number.parseInt(quantity)
      if (item.quantity <= 0) {
        req.session.cart = req.session.cart.filter((item) => item.bookId !== bookId)
      }
    }

    res.json({ success: true, message: "Cart updated" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Remove from cart
router.post("/remove", requireAuth, (req, res) => {
  try {
    const { bookId } = req.body

    if (req.session.cart) {
      req.session.cart = req.session.cart.filter((item) => item.bookId !== bookId)
    }

    res.json({ success: true, message: "Item removed from cart" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Clear cart
router.post("/clear", requireAuth, (req, res) => {
  req.session.cart = []
  res.json({ success: true, message: "Cart cleared" })
})

module.exports = router
