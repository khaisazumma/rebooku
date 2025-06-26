const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const Book = require("../models/Book")
const Article = require("../models/Article")
const PromoCode = require("../models/PromoCode")

// Sample data
const sampleUsers = [
  {
    username: "admin",
    email: "admin@rebooku.com",
    password: "admin123",
    fullName: "Administrator",
    role: "admin",
  },
  {
    username: "johndoe",
    email: "john@example.com",
    password: "password123",
    fullName: "John Doe",
    phone: "081234567890",
    address: "Jakarta, Indonesia",
  },
  {
    username: "janedoe",
    email: "jane@example.com",
    password: "password123",
    fullName: "Jane Doe",
    phone: "081234567891",
    address: "Bandung, Indonesia",
  },
]

const sampleBooks = [
  {
    title: "Harry Potter dan Batu Bertuah",
    author: "J.K. Rowling",
    isbn: "9780747532699",
    category: "Fantasy",
    condition: "Good",
    price: 75000,
    originalPrice: 150000,
    description: "Buku pertama dari seri Harry Potter dalam kondisi baik. Sedikit bekas baca tapi masih layak koleksi.",
    images: ["harry-potter-1.jpg"],
    featured: true,
  },
  {
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    isbn: "9789792248074",
    category: "Fiction",
    condition: "Excellent",
    price: 45000,
    originalPrice: 89000,
    description: "Novel bestseller Indonesia tentang perjuangan anak-anak Belitung menempuh pendidikan.",
    images: ["laskar-pelangi.jpg"],
    featured: true,
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    category: "Self-Help",
    condition: "Good",
    price: 120000,
    originalPrice: 200000,
    description: "Panduan praktis membangun kebiasaan baik dan menghilangkan kebiasaan buruk.",
    images: ["atomic-habits.jpg"],
    featured: true,
  },
  {
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    category: "History",
    condition: "Excellent",
    price: 95000,
    originalPrice: 180000,
    description: "Sejarah singkat umat manusia dari zaman batu hingga era modern.",
    images: ["sapiens.jpg"],
    featured: true,
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    isbn: "9780857197689",
    category: "Finance",
    condition: "Good",
    price: 85000,
    originalPrice: 160000,
    description: "Buku tentang psikologi keuangan dan cara pandang terhadap uang.",
    images: ["psychology-money.jpg"],
    featured: true,
  },
  {
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    isbn: "9789799731240",
    category: "Literature",
    condition: "Fair",
    price: 35000,
    originalPrice: 70000,
    description: "Novel klasik Indonesia karya Pramoedya Ananta Toer.",
    images: ["bumi-manusia.jpg"],
    featured: true,
  },
]

const sampleArticles = [
  {
    title: "Tips Memilih Buku Bekas Berkualitas",
    content: `
      <p>Membeli buku bekas bisa menjadi pilihan cerdas untuk menghemat budget sambil tetap mendapatkan bacaan berkualitas. Berikut adalah tips untuk memilih buku bekas yang berkualitas:</p>
      
      <h3>1. Periksa Kondisi Fisik Buku</h3>
      <p>Pastikan sampul buku masih utuh, tidak robek atau rusak parah. Periksa juga halaman dalam apakah ada yang hilang atau rusak.</p>
      
      <h3>2. Cek Kualitas Kertas</h3>
      <p>Hindari buku dengan kertas yang sudah menguning parah atau rapuh karena bisa mudah rusak saat dibaca.</p>
      
      <h3>3. Perhatikan Tulisan atau Coretan</h3>
      <p>Beberapa orang suka menulis catatan di buku. Pastikan coretan tidak mengganggu kenyamanan membaca.</p>
      
      <h3>4. Bandingkan Harga</h3>
      <p>Jangan langsung beli di tempat pertama. Bandingkan harga di beberapa tempat untuk mendapatkan deal terbaik.</p>
    `,
    excerpt: "Panduan lengkap memilih buku bekas berkualitas dengan harga terjangkau untuk para book lovers.",
    category: "Tips",
    tags: ["buku bekas", "tips", "panduan"],
    image: "tips-buku-bekas.jpg",
  },
  {
    title: "Review: Atomic Habits - Buku Wajib untuk Self-Improvement",
    content: `
      <p>Atomic Habits karya James Clear adalah salah satu buku self-help terbaik yang pernah saya baca. Buku ini memberikan panduan praktis tentang bagaimana membangun kebiasaan baik dan menghilangkan kebiasaan buruk.</p>
      
      <h3>Kelebihan Buku Ini:</h3>
      <ul>
        <li>Penjelasan yang mudah dipahami dengan contoh nyata</li>
        <li>Framework yang bisa langsung diterapkan</li>
        <li>Didukung riset ilmiah yang solid</li>
        <li>Gaya penulisan yang engaging dan tidak membosankan</li>
      </ul>
      
      <h3>Konsep Utama:</h3>
      <p>Buku ini mengajarkan bahwa perubahan kecil yang konsisten akan memberikan hasil yang luar biasa dalam jangka panjang. Konsep "1% better every day" menjadi inti dari seluruh buku.</p>
      
      <h3>Rating: 9/10</h3>
      <p>Sangat direkomendasikan untuk siapa saja yang ingin mengembangkan diri dan membangun kebiasaan positif.</p>
    `,
    excerpt:
      "Review mendalam tentang buku Atomic Habits dan mengapa buku ini wajib dibaca oleh siapa saja yang ingin berkembang.",
    category: "Review",
    tags: ["review", "atomic habits", "self-help"],
    image: "atomic-habits-review.jpg",
  },
  {
    title: "Komunitas Baca: Manfaat Bergabung dengan Book Club",
    content: `
      <p>Bergabung dengan komunitas baca atau book club memiliki banyak manfaat yang mungkin tidak Anda sadari. Selain menambah teman, ada banyak keuntungan lain yang bisa didapat.</p>
      
      <h3>Manfaat Bergabung Book Club:</h3>
      
      <h4>1. Motivasi Membaca</h4>
      <p>Dengan adanya jadwal diskusi rutin, Anda akan lebih termotivasi untuk menyelesaikan bacaan tepat waktu.</p>
      
      <h4>2. Perspektif Baru</h4>
      <p>Diskusi dengan anggota lain akan membuka mata Anda terhadap sudut pandang yang berbeda tentang buku yang sama.</p>
      
      <h4>3. Rekomendasi Buku</h4>
      <p>Anda akan mendapat rekomendasi buku-buku bagus dari sesama anggota yang memiliki selera baca beragam.</p>
      
      <h4>4. Networking</h4>
      <p>Bertemu dengan orang-orang yang memiliki minat yang sama bisa membuka peluang networking yang berharga.</p>
      
      <p>Jadi, tunggu apa lagi? Cari book club di sekitar Anda atau buat sendiri bersama teman-teman!</p>
    `,
    excerpt: "Mengapa bergabung dengan komunitas baca bisa memberikan pengalaman membaca yang lebih kaya dan bermakna.",
    category: "Komunitas",
    tags: ["book club", "komunitas", "membaca"],
    image: "book-club.jpg",
  },
]

const samplePromoCodes = [
  {
    code: "WELCOME10",
    description: "Diskon 10% untuk pengguna baru",
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 50000,
    maxDiscount: 25000,
    usageLimit: 100,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  },
  {
    code: "BOOKFEST",
    description: "Festival buku - diskon Rp 20.000",
    discountType: "fixed",
    discountValue: 20000,
    minPurchase: 100000,
    usageLimit: 50,
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  },
]

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/rebooku", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    console.log("Connected to MongoDB")

    // Clear existing data
    await User.deleteMany({})
    await Book.deleteMany({})
    await Article.deleteMany({})
    await PromoCode.deleteMany({})

    console.log("Cleared existing data")

    // Create users
    const users = []
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = new User({
        ...userData,
        password: hashedPassword,
      })
      await user.save()
      users.push(user)
    }

    console.log("Created users")

    // Create books
    const regularUsers = users.filter((user) => user.role === "user")
    for (const bookData of sampleBooks) {
      const randomSeller = regularUsers[Math.floor(Math.random() * regularUsers.length)]
      const book = new Book({
        ...bookData,
        seller: randomSeller._id,
      })
      await book.save()
    }

    console.log("Created books")

    // Create articles
    for (const articleData of sampleArticles) {
      const randomAuthor = regularUsers[Math.floor(Math.random() * regularUsers.length)]
      const article = new Article({
        ...articleData,
        author: randomAuthor._id,
      })
      await article.save()
    }

    console.log("Created articles")

    // Create promo codes
    const adminUser = users.find((user) => user.role === "admin")
    for (const promoData of samplePromoCodes) {
      const promoCode = new PromoCode({
        ...promoData,
        createdBy: adminUser._id,
      })
      await promoCode.save()
    }

    console.log("Created promo codes")

    console.log("Database seeded successfully!")
    console.log("\nLogin credentials:")
    console.log("Admin - Username: admin, Password: admin123")
    console.log("User 1 - Username: johndoe, Password: password123")
    console.log("User 2 - Username: janedoe, Password: password123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
