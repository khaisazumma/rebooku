const mongoose = require("mongoose")

const transactionItemSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
})

const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, unique: true, required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [transactionItemSchema],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  promoCode: String,
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
  },
  paymentMethod: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Transaction", transactionSchema)
