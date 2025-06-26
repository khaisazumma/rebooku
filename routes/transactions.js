const express = require("express")
const Transaction = require("../models/Transaction")
const Book = require("../models/Book")
const PromoCode = require("../models/PromoCode")
const { requireAuth } = require("../middleware/auth")
const router = express.Router()

// Checkout page
router.get("/checkout", requireAuth, (req, res) => {
  const cart = req.session.cart || []
  if (cart.length === 0) {
    return res.redirect("/cart")
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  res.render("transactions/checkout", {
    user: req.session.user,
    cart,
    subtotal,
    error: null,
  })
})

// Validate promo code
router.post("/validate-promo", requireAuth, async (req, res) => {
  try {
    const { code, subtotal } = req.body

    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() },
      usedCount: { $lt: "$usageLimit" },
    })

    if (!promoCode) {
      return res.json({ valid: false, message: "Invalid or expired promo code" })
    }

    if (subtotal < promoCode.minPurchase) {
      return res.json({
        valid: false,
        message: `Minimum purchase of $${promoCode.minPurchase} required`,
      })
    }

    let discount = 0
    if (promoCode.discountType === "percentage") {
      discount = (subtotal * promoCode.discountValue) / 100
      if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
        discount = promoCode.maxDiscount
      }
    } else {
      discount = promoCode.discountValue
    }

    res.json({
      valid: true,
      discount,
      description: promoCode.description,
    })
  } catch (error) {
    console.error(error)
    res.json({ valid: false, message: "Server error" })
  }
})

// Process checkout
router.post("/checkout", requireAuth, async (req, res) => {
  try {
    const { fullName, phone, address, city, postalCode, paymentMethod, promoCode } = req.body
    const cart = req.session.cart || []

    if (cart.length === 0) {
      return res.redirect("/cart")
    }

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    let discount = 0

    // Apply promo code if provided
    if (promoCode) {
      const promo = await PromoCode.findOne({
        code: promoCode.toUpperCase(),
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() },
        usedCount: { $lt: "$usageLimit" },
      })

      if (promo && subtotal >= promo.minPurchase) {
        if (promo.discountType === "percentage") {
          discount = (subtotal * promo.discountValue) / 100
          if (promo.maxDiscount && discount > promo.maxDiscount) {
            discount = promo.maxDiscount
          }
        } else {
          discount = promo.discountValue
        }

        // Update promo code usage
        promo.usedCount += 1
        await promo.save()
      }
    }

    const finalAmount = subtotal - discount

    // Generate transaction ID
    const transactionId = "TXN" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase()

    // Create transaction
    const transaction = new Transaction({
      transactionId,
      buyer: req.session.user.id,
      items: cart.map((item) => ({
        book: item.bookId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount: subtotal,
      discount,
      finalAmount,
      promoCode: promoCode || null,
      shippingAddress: {
        fullName,
        phone,
        address,
        city,
        postalCode,
      },
      paymentMethod,
    })

    await transaction.save()

    // Update book stock
    for (const item of cart) {
      await Book.findByIdAndUpdate(item.bookId, {
        $inc: { stock: -item.quantity },
      })
    }

    // Clear cart
    req.session.cart = []

    res.redirect(`/transactions/${transaction._id}?success=true`)
  } catch (error) {
    console.error(error)
    res.render("transactions/checkout", {
      user: req.session.user,
      cart: req.session.cart || [],
      subtotal: 0,
      error: "Checkout failed. Please try again.",
    })
  }
})

// Transaction detail
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("buyer", "username fullName email")
      .populate("items.book", "title author images seller")

    if (!transaction) {
      return res.status(404).render("error", {
        message: "Transaction not found",
        user: req.session.user,
      })
    }

    // Check if user owns this transaction or is admin
    if (transaction.buyer._id.toString() !== req.session.user.id && req.session.user.role !== "admin") {
      return res.status(403).render("error", {
        message: "Access denied",
        user: req.session.user,
      })
    }

    const success = req.query.success === "true"

    res.render("transactions/detail", {
      user: req.session.user,
      transaction,
      success,
    })
  } catch (error) {
    console.error(error)
    res.status(500).render("error", {
      message: "Server error",
      user: req.session.user,
    })
  }
})

// Transaction history
router.get("/", requireAuth, async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const transactions = await Transaction.find({ buyer: req.session.user.id })
      .populate("items.book", "title author images")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalTransactions = await Transaction.countDocuments({ buyer: req.session.user.id })
    const totalPages = Math.ceil(totalTransactions / limit)

    res.render("transactions/history", {
      user: req.session.user,
      transactions,
      currentPage: page,
      totalPages,
    })
  } catch (error) {
    console.error(error)
    res.render("transactions/history", {
      user: req.session.user,
      transactions: [],
      currentPage: 1,
      totalPages: 1,
    })
  }
})

module.exports = router
