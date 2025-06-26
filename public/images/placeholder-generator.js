// Script untuk generate placeholder images
// Jalankan di browser console untuk membuat placeholder images

function generatePlaceholderImages() {
  const images = [
    { name: "hero-books.jpg", width: 600, height: 400, text: "Hero Books" },
    { name: "book-placeholder.jpg", width: 300, height: 400, text: "Book Cover" },
    { name: "article-placeholder.jpg", width: 400, height: 250, text: "Article Image" },
    { name: "harry-potter-1.jpg", width: 300, height: 400, text: "Harry Potter" },
    { name: "laskar-pelangi.jpg", width: 300, height: 400, text: "Laskar Pelangi" },
    { name: "atomic-habits.jpg", width: 300, height: 400, text: "Atomic Habits" },
    { name: "sapiens.jpg", width: 300, height: 400, text: "Sapiens" },
    { name: "psychology-money.jpg", width: 300, height: 400, text: "Psychology of Money" },
    { name: "bumi-manusia.jpg", width: 300, height: 400, text: "Bumi Manusia" },
    { name: "tips-buku-bekas.jpg", width: 600, height: 300, text: "Tips Buku Bekas" },
    { name: "atomic-habits-review.jpg", width: 600, height: 300, text: "Book Review" },
    { name: "book-club.jpg", width: 600, height: 300, text: "Book Club" },
    { name: "book-photo-good.jpg", width: 400, height: 300, text: "Good Photo" },
    { name: "book-photo-bad.jpg", width: 400, height: 300, text: "Bad Photo" },
    { name: "seller-1.jpg", width: 100, height: 100, text: "Sarah" },
    { name: "seller-2.jpg", width: 100, height: 100, text: "Ahmad" },
  ]

  images.forEach((img) => {
    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d")

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, img.width, img.height)
    gradient.addColorStop(0, "#667eea")
    gradient.addColorStop(1, "#764ba2")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, img.width, img.height)

    // Text
    ctx.fillStyle = "white"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(img.text, img.width / 2, img.height / 2)

    // Download
    const link = document.createElement("a")
    link.download = img.name
    link.href = canvas.toDataURL()
    link.click()
  })
}

// Uncomment to generate images
// generatePlaceholderImages()
