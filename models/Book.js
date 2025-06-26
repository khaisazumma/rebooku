const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now },
})

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: String,
  category: { type: String, required: true },
  condition: { type: String, enum: ["Excellent", "Good", "Fair", "Poor"], required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  description: String,
  images: [String],
  stock: { type: Number, default: 1 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["available", "sold", "pending"], default: "available" },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

bookSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.averageRating = 0
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0)
    this.averageRating = sum / this.reviews.length
  }
}

module.exports = mongoose.model("Book", bookSchema)
