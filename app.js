const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const bcrypt = require("bcrypt")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const app = express()
const PORT = process.env.PORT || 3000

// Import routes
const authRoutes = require("./routes/auth")
const bookRoutes = require("./routes/books")
const articleRoutes = require("./routes/articles")
const userRoutes = require("./routes/user")
const adminRoutes = require("./routes/admin")
const cartRoutes = require("./routes/cart")
const transactionRoutes = require("./routes/transactions")

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/rebooku", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

// Session configuration
app.use(
  session({
    secret: "rebooku-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/rebooku",
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  }),
)

// View engine
app.set("view engine", "ejs")
app.set("views", "./views")

// Create upload directories
const uploadDirs = ["uploads/books", "uploads/articles", "uploads/users"]
uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// Routes
app.use("/auth", authRoutes)
app.use("/books", bookRoutes)
app.use("/articles", articleRoutes)
app.use("/user", userRoutes)
app.use("/admin", adminRoutes)
app.use("/cart", cartRoutes)
app.use("/transactions", transactionRoutes)

// Home route
app.get("/", async (req, res) => {
  try {
    const Book = require("./models/Book")
    const Article = require("./models/Article")

    const featuredBooks = await Book.find({ featured: true }).limit(6)
    const recentArticles = await Article.find().sort({ createdAt: -1 }).limit(3).populate("author")

    res.render("index", {
      user: req.session.user,
      featuredBooks,
      recentArticles,
    })
  } catch (error) {
    console.error(error)
    res.render("index", {
      user: req.session.user,
      featuredBooks: [],
      recentArticles: [],
    })
  }
})

// Seller guide route
app.get("/seller-guide", (req, res) => {
  res.render("seller-guide", { user: req.session.user })
})

app.listen(PORT, () => {
  console.log(`Rebooku server running on port ${PORT}`)
})
