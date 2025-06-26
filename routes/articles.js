const express = require("express")
const multer = require("multer")
const path = require("path")
const Article = require("../models/Article")
const { requireAuth } = require("../middleware/auth")
const router = express.Router()

// Multer configuration for article images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/articles/")
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
  limits: { fileSize: 5 * 1024 * 1024 },
})

// Articles list
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query
    const page = Number.parseInt(req.query.page) || 1
    const limit = 9
    const skip = (page - 1) * limit

    const query = { status: "published" }

    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }, { content: { $regex: search, $options: "i" } }]
    }

    if (category && category !== "all") {
      query.category = category
    }

    const articles = await Article.find(query)
      .populate("author", "username fullName profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalArticles = await Article.countDocuments(query)
    const totalPages = Math.ceil(totalArticles / limit)

    const categories = await Article.distinct("category")

    res.render("articles/list", {
      user: req.session.user,
      articles,
      categories,
      currentPage: page,
      totalPages,
      filters: { search, category },
    })
  } catch (error) {
    console.error(error)
    res.render("articles/list", {
      user: req.session.user,
      articles: [],
      categories: [],
      currentPage: 1,
      totalPages: 1,
      filters: {},
    })
  }
})

// Article detail
router.get("/:id", async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate("author", "username fullName profileImage")
      .populate("comments.user", "username fullName profileImage")
      .populate("comments.replies.user", "username fullName profileImage")

    if (!article) {
      return res.status(404).render("error", {
        message: "Article not found",
        user: req.session.user,
      })
    }

    // Increment views
    article.views += 1
    await article.save()

    // Get related articles
    const relatedArticles = await Article.find({
      category: article.category,
      _id: { $ne: article._id },
      status: "published",
    })
      .limit(3)
      .populate("author", "username")

    res.render("articles/detail", {
      user: req.session.user,
      article,
      relatedArticles,
    })
  } catch (error) {
    console.error(error)
    res.status(500).render("error", {
      message: "Server error",
      user: req.session.user,
    })
  }
})

// Create article page
router.get("/create/new", requireAuth, (req, res) => {
  res.render("articles/create", { user: req.session.user, error: null })
})

// Create article process
router.post("/create", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, content, category, tags, excerpt } = req.body

    const article = new Article({
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + "...",
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      image: req.file ? req.file.filename : null,
      author: req.session.user.id,
    })

    await article.save()
    res.redirect("/articles?success=article-created")
  } catch (error) {
    console.error(error)
    res.render("articles/create", {
      user: req.session.user,
      error: "Failed to create article. Please try again.",
    })
  }
})

// Add comment
router.post("/:id/comment", requireAuth, async (req, res) => {
  try {
    const { content } = req.body
    const article = await Article.findById(req.params.id)

    if (!article) {
      return res.status(404).json({ error: "Article not found" })
    }

    article.comments.push({
      user: req.session.user.id,
      content,
    })

    await article.save()
    res.json({ success: true, message: "Comment added successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Like comment
router.post("/:articleId/comment/:commentId/like", requireAuth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId)
    const comment = article.comments.id(req.params.commentId)

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" })
    }

    const likeIndex = comment.likes.indexOf(req.session.user.id)
    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1)
    } else {
      comment.likes.push(req.session.user.id)
    }

    await article.save()
    res.json({ success: true, likes: comment.likes.length })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

// Reply to comment
router.post("/:articleId/comment/:commentId/reply", requireAuth, async (req, res) => {
  try {
    const { content } = req.body
    const article = await Article.findById(req.params.articleId)
    const comment = article.comments.id(req.params.commentId)

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" })
    }

    comment.replies.push({
      user: req.session.user.id,
      content,
    })

    await article.save()
    res.json({ success: true, message: "Reply added successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
