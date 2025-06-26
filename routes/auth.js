const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const router = express.Router()

// Register page
router.get("/register", (req, res) => {
  res.render("auth/register", { error: null, user: null })
})

// Register process
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, fullName, phone } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.render("auth/register", {
        error: "Username or email already exists",
        user: null,
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      phone,
    })

    await user.save()
    res.redirect("/auth/login?registered=true")
  } catch (error) {
    console.error(error)
    res.render("auth/register", {
      error: "Registration failed. Please try again.",
      user: null,
    })
  }
})

// Login page
router.get("/login", (req, res) => {
  const message = req.query.registered ? "Registration successful! Please login." : null
  res.render("auth/login", { error: null, message, user: null })
})

// Login process
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    })

    if (!user) {
      return res.render("auth/login", {
        error: "Invalid username or password",
        message: null,
        user: null,
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.render("auth/login", {
        error: "Invalid username or password",
        message: null,
        user: null,
      })
    }

    // Create session
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    }

    // Redirect based on role
    if (user.role === "admin") {
      res.redirect("/admin/dashboard")
    } else {
      res.redirect("/user/dashboard")
    }
  } catch (error) {
    console.error(error)
    res.render("auth/login", {
      error: "Login failed. Please try again.",
      message: null,
      user: null,
    })
  }
})

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})

module.exports = router
