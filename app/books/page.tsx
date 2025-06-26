"use client";

import { Label } from "@/components/ui/label";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, Filter, Star, Heart, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviews: number;
  condition: string;
  category: string;
  seller: string;
  description: string;
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  const { addToCart } = useCart();
  const { toast } = useToast();

  const booksPerPage = 12;

  useEffect(() => {
    const mockBooks: Book[] = [
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
        category: "Fiksi",
        seller: "Toko Buku Jakarta",
        description:
          "Novel fenomenal tentang perjuangan pendidikan di Belitung yang menginspirasi jutaan pembaca Indonesia.",
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
        category: "Sejarah",
        seller: "Pustaka Bandung",
        description:
          "Karya masterpiece Pramoedya yang mengisahkan perjalanan Minke dalam mencari jati diri bangsa.",
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
        category: "Fiksi",
        seller: "ReadMore Store",
        description:
          "Novel dengan teknik realisme magis yang memukau, mengisahkan sejarah Indonesia melalui sudut pandang unik.",
      },
      {
        id: "4",
        title: "Perburuan",
        author: "Pramoedya Ananta Toer",
        price: 70000,
        originalPrice: 130000,
        image:
          "https://pbs.twimg.com/media/GtPhs5wasAApmJ6?format=jpg&name=large",
        rating: 4.6,
        reviews: 78,
        condition: "Baik",
        category: "Sejarah",
        seller: "Book Corner",
        description:
          "Thriller politik yang menggugah tentang perjuangan dan pengkhianatan di masa revolusi Indonesia.",
      },
      {
        id: "5",
        title: "Ronggeng Dukuh Paruk",
        author: "Ahmad Tohari",
        price: 80000,
        originalPrice: 140000,
        image:
          "https://www.mediajabar.com/wp-content/uploads/2023/08/Resensi-dan-Sinopsis-Novel-Ronggeng-Dukuh-Paruk-Karya-Ahmad.webp",
        rating: 4.8,
        reviews: 203,
        condition: "Sangat Baik",
        category: "Fiksi",
        seller: "Sastra Nusantara",
        description:
          "Trilogi yang mengangkat tradisi ronggeng dan kritik sosial terhadap modernisasi.",
      },
      {
        id: "6",
        title: "Ayat-Ayat Cinta",
        author: "Habiburrahman El Shirazy",
        price: 60000,
        originalPrice: 100000,
        image:
          "https://cnc-magazine.oramiland.com/parenting/images/novel_ayat_ayat_cinta_IYWT78T.width-800.format-webp.webp",
        rating: 4.5,
        reviews: 167,
        condition: "Baik",
        category: "Fiksi",
        seller: "Islamic Books",
        description:
          "Novel yang menggabungkan nilai-nilai Islam dengan kisah cinta yang menyentuh hati.",
      },
      {
        id: "7",
        title: "Negeri 5 Menara",
        author: "Ahmad Fuadi",
        price: 68000,
        originalPrice: 115000,
        image:
          "https://img.lazcdn.com/g/ff/kf/S073f206af7de45c9b39da2bf5030df03Q.jpg_360x360q80.jpg_.webp",
        rating: 4.7,
        reviews: 142,
        condition: "Sangat Baik",
        category: "Self Help",
        seller: "Motivasi Store",
        description:
          "Kisah inspiratif tentang perjuangan menuntut ilmu dan meraih mimpi setinggi langit.",
      },
      {
        id: "8",
        title: "Sang Pemimpi",
        author: "Andrea Hirata",
        price: 72000,
        originalPrice: 125000,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM25vuvYX--jWKsSJwPofqNYZYBM6uRcv7EA&s",
        rating: 4.6,
        reviews: 98,
        condition: "Baik",
        category: "Fiksi",
        seller: "Belitung Books",
        description:
          "Sekuel Laskar Pelangi yang mengisahkan perjalanan Ikal dan Arai mengejar mimpi ke Eropa.",
      },
      {
        id: "9",
        title: "Pulang",
        author: "Tere Liye",
        price: 55000,
        originalPrice: 95000,
        image:
          "https://media.karousell.com/media/photos/products/2024/5/18/novel_asli_pulang_tere_liye_ce_1716028779_540e86d1_progressive.jpg",
        rating: 4.4,
        reviews: 186,
        condition: "Cukup",
        category: "Psikologi",
        seller: "Tere Liye Store",
        description:
          "Novel yang mengisahkan perjalanan hidup dan pencarian makna pulang yang sesungguhnya.",
      },
      {
        id: "10",
        title: "Hujan",
        author: "Tere Liye",
        price: 58000,
        originalPrice: 98000,
        image:
          "https://image.idntimes.com/post/20211220/img-20211220-174140-c8f3bb774e08b33a08ce94ef88ba3c71-bae9af46ad2efa83ea7f91ce39e57ce8.JPG",
        rating: 4.5,
        reviews: 134,
        condition: "Baik",
        category: "Sains",
        seller: "Fantasy Books ID",
        description:
          "Petualangan fantasi ilmiah dalam dunia penuh bencana, mengisahkan tentang cinta, kehilangan, dan harapan.",
      },
      {
        id: "11",
        title: "Dilan 1990",
        author: "Pidi Baiq",
        price: 45000,
        originalPrice: 75000,
        image:
          "https://images.tokopedia.net/img/cache/250-square/VqbcmM/2025/5/24/b9330553-e5d5-4aca-8067-ef8ac3e35350.jpg?ect=4g",
        rating: 4.3,
        reviews: 245,
        condition: "Sangat Baik",
        category: "Fiksi",
        seller: "Teen Romance",
        description:
          "Kisah cinta remaja yang fenomenal di Bandung tahun 1990 yang mengaduk emosi pembaca.",
      },
      {
        id: "12",
        title: "Laut Bercerita",
        author: "Leila S. Chudori",
        price: 78000,
        originalPrice: 135000,
        image:
          "https://cdn.mediajabar.com/2023/08/Resensi-Novel-Laut-Bercerita-Karya-Leila-S.-Chudori.webp",
        rating: 4.8,
        reviews: 167,
        condition: "Sangat Baik",
        category: "Sejarah",
        seller: "Historical Books",
        description:
          "Novel yang mengangkat kisah kelam sejarah Indonesia dengan narasi yang memukau.",
      },
    ];

    setBooks(mockBooks);
    setFilteredBooks(mockBooks);

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("rebooku_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Filter and search logic
  useEffect(() => {
    const filtered = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || book.category === selectedCategory;
      const matchesCondition =
        selectedCondition === "all" || book.condition === selectedCondition;
      const matchesPrice =
        book.price >= priceRange[0] && book.price <= priceRange[1];

      return (
        matchesSearch && matchesCategory && matchesCondition && matchesPrice
      );
    });

    // Sort books
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
      default:
        // Keep original order for newest
        break;
    }

    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [
    books,
    searchTerm,
    selectedCategory,
    selectedCondition,
    priceRange,
    sortBy,
  ]);

  const toggleFavorite = (bookId: string) => {
    const newFavorites = favorites.includes(bookId)
      ? favorites.filter((id) => id !== bookId)
      : [...favorites, bookId];

    setFavorites(newFavorites);
    localStorage.setItem("rebooku_favorites", JSON.stringify(newFavorites));

    toast({
      title: favorites.includes(bookId)
        ? "Dihapus dari favorit"
        : "Ditambah ke favorit",
      description: favorites.includes(bookId)
        ? "Buku telah dihapus dari daftar favorit"
        : "Buku telah ditambahkan ke daftar favorit",
    });
  };

  const handleAddToCart = (book: Book) => {
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      image: book.image,
      seller: book.seller,
    });

    toast({
      title: "Ditambahkan ke keranjang",
      description: `${book.title} telah ditambahkan ke keranjang`,
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);

  const categories = [
    "all",
    "Fiksi",
    "Non-Fiksi",
    "Bisnis",
    "Teknologi",
    "Sejarah",
    "Sains",
    "Self Help",
    "Psikologi",
  ];
  const conditions = ["all", "Sangat Baik", "Baik", "Cukup"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Katalog Buku
          </h1>
          <p className="text-gray-600">
            Temukan buku bekas berkualitas dengan harga terjangkau
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filter
              </h3>

              {/* Search */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">
                  Pencarian
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Cari buku atau penulis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">
                  Kategori
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "Semua Kategori" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Condition Filter */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">
                  Kondisi
                </Label>
                <Select
                  value={selectedCondition}
                  onValueChange={setSelectedCondition}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kondisi" />
                  </SelectTrigger>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem key={condition} value={condition}>
                        {condition === "all" ? "Semua Kondisi" : condition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">
                  Rentang Harga: Rp {priceRange[0].toLocaleString()} - Rp{" "}
                  {priceRange[1].toLocaleString()}
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={500000}
                  min={0}
                  step={10000}
                  className="w-full"
                />
              </div>
            </Card>
          </div>

          {/* Books Grid */}
          <div className="lg:col-span-3">
            {/* Sort and Results Info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <p className="text-gray-600">
                  Menampilkan {startIndex + 1}-
                  {Math.min(endIndex, filteredBooks.length)} dari{" "}
                  {filteredBooks.length} buku
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Label className="text-sm">Urutkan:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="price-low">Harga Terendah</SelectItem>
                    <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                    <SelectItem value="rating">Rating Tertinggi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Books Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentBooks.map((book) => (
                <Card
                  key={book.id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <Link href={`/books/${book.id}`}>
                        <img
                          src={book.image || "/laskar pelangi.jpeg"}
                          alt={book.title}
                          className="w-full h-48 object-cover rounded-md group-hover:scale-105 transition-transform"
                        />
                      </Link>
                      <Badge className="absolute top-2 left-2 bg-green-500">
                        {book.condition}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => toggleFavorite(book.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.includes(book.id)
                              ? "text-red-500 fill-current"
                              : "text-gray-600"
                          }`}
                        />
                      </Button>
                    </div>

                    <Link href={`/books/${book.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>

                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {book.rating} ({book.reviews} review)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-blue-600">
                          Rp {book.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 line-through ml-2">
                          Rp {book.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">
                      Dijual oleh: {book.seller}
                    </p>

                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(book)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Tambah ke Keranjang
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  )
                )}

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada buku ditemukan
                </h3>
                <p className="text-gray-600 mb-4">
                  Coba ubah filter pencarian atau kata kunci Anda
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSelectedCondition("all");
                    setPriceRange([0, 500000]);
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
