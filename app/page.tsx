import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, Shield, Star, Heart, Search, ShoppingCart } from "lucide-react";

export default function HomePage() {
  const featuredBooks = [
    {
      id: "1",
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      price: 75000,
      originalPrice: 120000,
      image:
        "https://media.tampang.com/tm_images/article/202407/desain-tanpalm3tbzj0ye95c8xl.jpg",
      rating: 4.8,
      reviews: 124,
      condition: "Sangat Baik",
    },
    {
      id: "2",
      title: "Bumi Manusia",
      author: "Pramoedya Ananta Toer",
      price: 85000,
      originalPrice: 150000,
      image:
        "https://turcham.com/wp-content/uploads/2023/09/IMG_20230922_213539.jpg",
      rating: 4.9,
      reviews: 89,
      condition: "Baik",
    },
    {
      id: "3",
      title: "Cantik Itu Luka",
      author: "Eka Kurniawan",
      price: 65000,
      originalPrice: 110000,
      image:
        "https://djatinangor.com/wp-content/uploads/2017/10/1507035595145_1.jpg",
      rating: 4.7,
      reviews: 156,
      condition: "Sangat Baik",
    },
    {
      id: "4",
      title: "Negeri 5 Menara",
      author: "Ahmad Fuadi",
      price: 68000,
      originalPrice: 115000,
      image:
        "https://img.lazcdn.com/g/ff/kf/S073f206af7de45c9b39da2bf5030df03Q.jpg_360x360q80.jpg_.webp",
      rating: 4.7,
      reviews: 142,
      condition: "Sangat Baik",
    },
  ];

  const categories = [
    { name: "Novel Indonesia", count: 1250, icon: "📚" },
    { name: "Sastra Indonesia", count: 980, icon: "📖" },
    { name: "Sejarah Indonesia", count: 650, icon: "🏛️" },
    { name: "Sastra Islami", count: 420, icon: "🕌" },
    { name: "Budaya Nusantara", count: 380, icon: "🎭" },
    { name: "Inspiratif", count: 320, icon: "⭐" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Temukan Buku Impian Anda di{" "}
                <span className="text-yellow-300">Rebooku</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Platform marketplace buku bekas terpercaya dengan review
                komunitas. Beli buku berkualitas dengan harga terjangkau atau
                jual koleksi Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  asChild
                >
                  <Link href="/books">
                    <Search className="mr-2 h-5 w-5" />
                    Jelajahi Buku
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                  asChild
                >
                  <Link
                    href="/sell"
                    className="flex items-center text-blue-600"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5 text-blue-600" />
                    Jual Buku Anda
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/buku.jpg"
                alt="Hero Image"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Buku Tersedia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                5,000+
              </div>
              <div className="text-gray-600">Pengguna Aktif</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                15,000+
              </div>
              <div className="text-gray-600">Transaksi Sukses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8/5</div>
              <div className="text-gray-600">Rating Pengguna</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Buku Pilihan
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Koleksi buku terbaik dengan rating tinggi dari komunitas pembaca
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <Card
                key={book.id}
                className="group hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="relative mb-4">
                    <img
                      src={book.image || "/buku.jpg"}
                      alt={book.title}
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Badge className="absolute top-2 right-2 bg-green-500">
                      {book.condition}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                  <div className="flex items-center mb-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">
                      {book.rating} ({book.reviews} review)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-blue-600">
                        Rp {book.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400 line-through ml-2">
                        Rp {book.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/books">Lihat Semua Buku</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Kategori Populer
            </h2>
            <p className="text-gray-600">
              Jelajahi berbagai kategori buku sesuai minat Anda
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.name}
                className="text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">{category.count} buku</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Rebooku?
            </h2>
            <p className="text-gray-600">
              Platform terpercaya untuk jual beli buku bekas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Transaksi Aman</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Sistem pembayaran yang aman dan terpercaya dengan perlindungan
                  pembeli
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Komunitas Aktif</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Review dan rating dari komunitas pembaca untuk membantu
                  pilihan Anda
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Harga Terjangkau</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Dapatkan buku berkualitas dengan harga hingga 70% lebih murah
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Siap Memulai Perjalanan Membaca Anda?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Bergabunglah dengan ribuan pembaca lainnya di Rebooku
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              asChild
            >
              <Link href="/register">Daftar Sekarang</Link>
            </Button>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              asChild
            >
              <Link href="/books">Mulai Belanja</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
