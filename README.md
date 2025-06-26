# Rebooku - Marketplace Buku Bekas

Rebooku adalah platform marketplace buku bekas yang menggabungkan sistem jual beli dengan review komunitas. Platform ini memungkinkan pengguna untuk membeli dan menjual buku bekas dengan mudah, serta berbagi review dan artikel tentang buku.

## 🚀 Fitur Utama

### Untuk Pengguna Umum
- **Landing Page** dengan hero section dan call-to-action
- **Sistem Autentikasi** lengkap (register, login, logout)
- **Katalog Buku** dengan pencarian dan filter lanjutan
- **Detail Buku** dengan review dan rating
- **Sistem Review** dan rating untuk buku
- **Artikel & Blog** dengan sistem komentar
- **Keranjang Belanja** dan checkout
- **Riwayat Transaksi** lengkap
- **Dashboard Pengguna** dengan statistik

### Untuk Penjual
- **Jual Buku** dengan upload gambar multiple
- **Kelola Produk** (edit, hapus, update stok)
- **Dashboard Penjual** dengan analitik penjualan
- **Panduan Penjual** lengkap dengan tips

### Untuk Admin
- **Dashboard Admin** dengan statistik lengkap
- **Kelola Pengguna** (aktivasi, deaktivasi)
- **Kelola Buku** (moderasi, hapus)
- **Kelola Transaksi** (update status)
- **Kelola Artikel** (moderasi konten)
- **Sistem Promo Code** dengan validasi
- **Laporan & Statistik** dengan Chart.js

### Fitur Teknis
- **Responsive Design** untuk semua perangkat
- **Upload Gambar** dengan Multer
- **Session Management** dengan MongoDB store
- **Password Hashing** dengan bcrypt
- **Search & Filter** lanjutan
- **Pagination** untuk performa optimal
- **Error Handling** yang komprehensif

## 🛠 Teknologi yang Digunakan

- **Backend**: Node.js, Express.js
- **Database**: MongoDB dengan Mongoose
- **Template Engine**: EJS
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript
- **Authentication**: bcrypt, express-session
- **File Upload**: Multer
- **Charts**: Chart.js
- **Icons**: Font Awesome

## 📋 Persyaratan Sistem

- Node.js (v14 atau lebih baru)
- MongoDB (v4.4 atau lebih baru)
- NPM atau Yarn

## 🚀 Instalasi dan Setup

### 1. Clone Repository
\`\`\`bash
git clone <repository-url>
cd rebooku-marketplace
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Install dan Jalankan MongoDB

#### Windows:
1. Download MongoDB dari [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install MongoDB Community Server
3. Jalankan MongoDB:
\`\`\`bash
# Buka Command Prompt sebagai Administrator
cd "C:\Program Files\MongoDB\Server\6.0\bin"
mongod --dbpath "C:\data\db"
\`\`\`

#### macOS:
\`\`\`bash
# Install dengan Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
\`\`\`

#### Linux (Ubuntu):
\`\`\`bash
# Import public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update dan install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
\`\`\`

### 4. Seed Database (Opsional)
\`\`\`bash
npm run seed
\`\`\`

### 5. Jalankan Aplikasi
\`\`\`bash
# Development mode
npm run dev

# Production mode
npm start
\`\`\`

### 6. Akses Aplikasi
Buka browser dan kunjungi: `http://localhost:3000`

## 👤 Akun Default (Setelah Seed)

### Admin
- **Username**: admin
- **Password**: admin123

### User Demo
- **Username**: johndoe
- **Password**: password123

- **Username**: janedoe  
- **Password**: password123

## 📁 Struktur Proyek

\`\`\`
rebooku-marketplace/
├── app.js                 # File utama aplikasi
├── package.json           # Dependencies dan scripts
├── README.md             # Dokumentasi
├── models/               # Model database
│   ├── User.js
│   ├── Book.js
│   ├── Article.js
│   ├── Transaction.js
│   └── PromoCode.js
├── routes/               # Route handlers
│   ├── auth.js
│   ├── books.js
│   ├── articles.js
│   ├── user.js
│   ├── admin.js
│   ├── cart.js
│   └── transactions.js
├── views/                # Template EJS
│   ├── layout.ejs
│   ├── index.ejs
│   ├── auth/
│   ├── books/
│   ├── articles/
│   ├── user/
│   ├── admin/
│   └── transactions/
├── public/               # File statis
│   ├── css/
│   ├── js/
│   └── images/
├── uploads/              # File upload
│   ├── books/
│   ├── articles/
│   └── users/
├── middleware/           # Custom middleware
│   └── auth.js
└── scripts/              # Utility scripts
    └── seed.js
\`\`\`

## 🎨 Wireframe Website

### 1. Landing Page
\`\`\`
+----------------------------------+
|  NAVBAR (Logo, Menu, Login)      |
+----------------------------------+
|                                  |
|  HERO SECTION                    |
|  - Judul besar                   |
|  - Deskripsi                     |
|  - CTA Buttons                   |
|  - Hero Image                    |
|                                  |
+----------------------------------+
|  FEATURES (3 kolom)              |
|  - Terpercaya                    |
|  - Harga Terjangkau              |
|  - Komunitas                     |
+----------------------------------+
|  FEATURED BOOKS (6 buku)         |
|  - Grid responsif                |
|  - Gambar, judul, harga          |
+----------------------------------+
|  RECENT ARTICLES (3 artikel)     |
|  - Card layout                   |
|  - Gambar, judul, excerpt        |
+----------------------------------+
|  CTA SECTION                     |
|  - Ajakan bergabung              |
+----------------------------------+
|  FOOTER                          |
|  - Links, kontak, sosmed        |
+----------------------------------+
\`\`\`

### 2. Katalog Buku
\`\`\`
+----------------------------------+
|  NAVBAR                          |
+----------------------------------+
|  SEARCH & FILTER BAR             |
|  - Search input                  |
|  - Category dropdown             |
|  - Price range                   |
|  - Condition filter              |
+----------------------------------+
|  BOOK GRID (3-4 kolom)           |
|  +--------+ +--------+ +--------+|
|  | Image  | | Image  | | Image  ||
|  | Title  | | Title  | | Title  ||
|  | Author | | Author | | Author ||
|  | Price  | | Price  | | Price  ||
|  | Rating | | Rating | | Rating ||
|  +--------+ +--------+ +--------+|
|  +--------+ +--------+ +--------+|
|  | Image  | | Image  | | Image  ||
|  | Title  | | Title  | | Title  ||
|  | Author | | Author | | Author ||
|  | Price  | | Price  | | Price  ||
|  | Rating | | Rating | | Rating ||
|  +--------+ +--------+ +--------+|
+----------------------------------+
|  PAGINATION                      |
+----------------------------------+
\`\`\`

### 3. Detail Buku
\`\`\`
+----------------------------------+
|  NAVBAR                          |
+----------------------------------+
|  BREADCRUMB                      |
+----------------------------------+
|  BOOK DETAIL                     |
|  +----------+  +---------------+ |
|  |          |  | Title         | |
|  |  Images  |  | Author        | |
|  | (Gallery)|  | Category      | |
|  |          |  | Condition     | |
|  |          |  | Price         | |
|  |          |  | Description   | |
|  |          |  | Add to Cart   | |
|  +----------+  +---------------+ |
+----------------------------------+
|  SELLER INFO                     |
|  - Profile, rating, contact      |
+----------------------------------+
|  REVIEWS SECTION                 |
|  - Rating summary                |
|  - Individual reviews            |
|  - Add review form               |
+----------------------------------+
|  RELATED BOOKS                   |
|  - 4 buku serupa                 |
+----------------------------------+
\`\`\`

### 4. Dashboard User
\`\`\`
+----------------------------------+
|  NAVBAR                          |
+----------------------------------+
|  DASHBOARD HEADER                |
|  - Welcome message               |
|  - Quick actions                 |
+----------------------------------+
|  STATISTICS CARDS (4 kolom)      |
|  +-------+ +-------+ +-------+   |
|  | Books | | Sold  | |Article|   |
|  | Listed| | Books | | Count |   |
|  +-------+ +-------+ +-------+   |
+----------------------------------+
|  RECENT ACTIVITIES (3 kolom)     |
|  +----------+ +----------+       |
|  | Recent   | | Recent   |       |
|  | Books    | | Articles |       |
|  |          | |          |       |
|  +----------+ +----------+       |
|  +----------+                    |
|  | Recent   |                    |
|  | Purchase |                    |
|  |          |                    |
|  +----------+                    |
+----------------------------------+
|  QUICK ACTIONS                   |
|  - Jual Buku, Tulis Artikel     |
+----------------------------------+
\`\`\`

### 5. Mobile Layout
\`\`\`
+------------------+
|  NAVBAR (Mobile) |
|  ☰ Logo    🛒 👤 |
+------------------+
|                  |
|  HERO SECTION    |
|  - Stack layout  |
|  - Full width    |
|                  |
+------------------+
|  FEATURES        |
|  - Single column |
|  - Stack cards   |
+------------------+
|  BOOKS GRID      |
|  +------+------+ |
|  |Book 1|Book 2| |
|  +------+------+ |
|  +------+------+ |
|  |Book 3|Book 4| |
|  +------+------+ |
+------------------+
\`\`\`

## 🔧 Konfigurasi

### Environment Variables
Buat file `.env` di root directory:
\`\`\`env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rebooku
SESSION_SECRET=your-secret-key-here
\`\`\`

### Upload Directories
Pastikan folder upload ada:
\`\`\`bash
mkdir -p uploads/books uploads/articles uploads/users
\`\`\`

## 📱 Responsive Design

Website ini sepenuhnya responsive dengan breakpoint:
- **Mobile**: < 576px
- **Tablet**: 576px - 768px  
- **Desktop**: > 768px

Fitur responsive meliputi:
- Navigation yang collapse di mobile
- Grid yang menyesuaikan ukuran layar
- Typography yang scalable
- Touch-friendly buttons
- Optimized images

## 🔒 Keamanan

- Password hashing dengan bcrypt
- Session-based authentication
- Input validation dan sanitization
- File upload restrictions
- CSRF protection ready
- SQL injection prevention (NoSQL)

## 🚀 Deployment

### Heroku
1. Install Heroku CLI
2. Login ke Heroku: `heroku login`
3. Create app: `heroku create rebooku-app`
4. Set environment variables:
\`\`\`bash
heroku config:set MONGODB_URI=your-mongodb-atlas-uri
heroku config:set SESSION_SECRET=your-secret-key
\`\`\`
5. Deploy: `git push heroku main`

### VPS/Server
1. Clone repository di server
2. Install dependencies: `npm install --production`
3. Setup MongoDB
4. Configure environment variables
5. Use PM2 untuk process management:
\`\`\`bash
npm install -g pm2
pm2 start app.js --name rebooku
pm2 startup
pm2 save
\`\`\`

## 🤝 Kontribusi

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📞 Support

Jika Anda mengalami masalah atau memiliki pertanyaan:

- **Email**: support@rebooku.com
- **WhatsApp**: +62 812-3456-7890
- **GitHub Issues**: [Create Issue](https://github.com/your-repo/issues)

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgments

- Bootstrap untuk UI framework
- Font Awesome untuk icons
- Chart.js untuk visualisasi data
- MongoDB untuk database
- Express.js untuk web framework

---

**Rebooku** - Marketplace Buku Bekas Terpercaya 📚
