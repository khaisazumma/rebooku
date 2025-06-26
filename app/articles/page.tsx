"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Star,
  MessageCircle,
  Eye,
  Calendar,
  Filter,
  BookOpen,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  bookId?: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookImage?: string;
  rating?: number;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  views: number;
  comments: number;
  likes: number;
  featured: boolean;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const articlesPerPage = 9;

  useEffect(() => {
    // Mock data artikel Indonesia
    const mockArticles: Article[] = [
      {
        id: "1",
        title: "Review: Laskar Pelangi - Karya Masterpiece Andrea Hirata",
        excerpt:
          "Mengulas novel fenomenal yang mengangkat semangat pendidikan di Belitung. Sebuah karya yang menginspirasi jutaan pembaca Indonesia.",
        content:
          "Laskar Pelangi adalah novel yang tidak hanya menghibur, tetapi juga memberikan pesan mendalam tentang pentingnya pendidikan...",
        author: {
          name: "Sari Dewi",
          avatar: "/buku.jpg",
          role: "Book Reviewer",
        },
        bookId: "1",
        bookTitle: "Laskar Pelangi",
        bookAuthor: "Andrea Hirata",
        bookImage:
          "https://media.tampang.com/tm_images/article/202407/desain-tanpalm3tbzj0ye95c8xl.jpg",
        rating: 5,
        category: "Review Buku",
        tags: ["Novel Indonesia", "Pendidikan", "Inspiratif"],
        publishDate: "2024-05-28",
        readTime: 8,
        views: 1250,
        comments: 45,
        likes: 89,
        featured: true,
      },
      {
        id: "2",
        title: "Mengapa Bumi Manusia Tetap Relevan di Era Modern",
        excerpt:
          "Analisis mendalam tentang relevansi karya Pramoedya Ananta Toer dalam konteks Indonesia kontemporer.",
        content:
          "Bumi Manusia bukan hanya novel sejarah, tetapi juga cermin kondisi sosial yang masih relevan hingga kini...",
        author: {
          name: "Ahmad Rizki",
          avatar: "/buku.jpg",
          role: "Literary Critic",
        },
        bookId: "2",
        bookTitle: "Bumi Manusia",
        bookAuthor: "Pramoedya Ananta Toer",
        bookImage: "https://cdn.mediajabar.com/2023/08/novel-bumi-manusia.webp",
        rating: 5,
        category: "Analisis Sastra",
        tags: ["Sastra Indonesia", "Sejarah", "Klasik"],
        publishDate: "2024-05-25",
        readTime: 12,
        views: 980,
        comments: 32,
        likes: 67,
        featured: true,
      },
      {
        id: "3",
        title: "Cantik Itu Luka: Keajaiban Realisme Magis Eka Kurniawan",
        excerpt:
          "Eksplorasi teknik bercerita unik dalam novel yang memadukan sejarah Indonesia dengan elemen fantasi.",
        content:
          "Eka Kurniawan berhasil menciptakan dunia yang memukau melalui teknik realisme magis yang brilian...",
        author: {
          name: "Budi Santoso",
          avatar: "/buku.jpg",
          role: "Literature Professor",
        },
        bookId: "3",
        bookTitle: "Cantik Itu Luka",
        bookAuthor: "Eka Kurniawan",
        bookImage:
          "https://djatinangor.com/wp-content/uploads/2017/10/1507035595145_1.jpg",
        rating: 4,
        category: "Review Buku",
        tags: ["Sastra Kontemporer", "Realisme Magis", "Indonesia"],
        publishDate: "2024-05-22",
        readTime: 10,
        views: 756,
        comments: 28,
        likes: 54,
        featured: false,
      },
      {
        id: "4",
        title: "Perburuan: Thriller Politik yang Menggugah",
        excerpt:
          "Review novel Pramoedya yang mengangkat tema perjuangan dan pengkhianatan di masa revolusi Indonesia.",
        content:
          "Perburuan menampilkan sisi gelap revolusi Indonesia dengan narasi yang mencekam dan karakter yang kompleks...",
        author: {
          name: "Maya Sari",
          avatar: "/buku.jpg",
          role: "Book Blogger",
        },
        bookId: "4",
        bookTitle: "Perburuan",
        bookAuthor: "Pramoedya Ananta Toer",
        bookImage:
          "https://pbs.twimg.com/media/GtPhs5wasAApmJ6?format=jpg&name=large",
        rating: 4,
        category: "Review Buku",
        tags: ["Thriller", "Politik", "Sejarah Indonesia"],
        publishDate: "2024-05-20",
        readTime: 7,
        views: 623,
        comments: 19,
        likes: 41,
        featured: false,
      },
      {
        id: "5",
        title: "Ronggeng Dukuh Paruk: Kritik Sosial dalam Balutan Seni",
        excerpt:
          "Mengulas trilogi Ahmad Tohari yang mengangkat tradisi ronggeng dan kritik terhadap modernisasi.",
        content:
          "Ahmad Tohari berhasil menghadirkan kritik sosial yang tajam melalui kisah Srintil dan tradisi ronggeng...",
        author: {
          name: "Indira Putri",
          avatar: "/buku.jpg",
          role: "Cultural Critic",
        },
        bookId: "5",
        bookTitle: "Ronggeng Dukuh Paruk",
        bookAuthor: "Ahmad Tohari",
        bookImage:
          "https://www.mediajabar.com/wp-content/uploads/2023/08/Resensi-dan-Sinopsis-Novel-Ronggeng-Dukuh-Paruk-Karya-Ahmad.webp",
        rating: 5,
        category: "Analisis Sastra",
        tags: ["Budaya Jawa", "Kritik Sosial", "Tradisi"],
        publishDate: "2024-05-18",
        readTime: 15,
        views: 892,
        comments: 36,
        likes: 73,
        featured: true,
      },
      {
        id: "6",
        title: "Ayat-Ayat Cinta: Fenomena Sastra Islami Indonesia",
        excerpt:
          "Analisis dampak novel Habiburrahman El Shirazy terhadap perkembangan sastra Islami di Indonesia.",
        content:
          "Ayat-Ayat Cinta membuka babak baru dalam sastra Indonesia dengan menggabungkan nilai-nilai Islam dan romansa...",
        author: {
          name: "Fatimah Zahra",
          avatar: "/buku.jpg",
          role: "Islamic Literature Scholar",
        },
        bookId: "6",
        bookTitle: "Ayat-Ayat Cinta",
        bookAuthor: "Habiburrahman El Shirazy",
        bookImage:
          "https://cnc-magazine.oramiland.com/parenting/images/novel_ayat_ayat_cinta_IYWT78T.width-800.format-webp.webp",
        rating: 4,
        category: "Analisis Sastra",
        tags: ["Sastra Islami", "Romance", "Spiritual"],
        publishDate: "2024-05-15",
        readTime: 9,
        views: 1100,
        comments: 52,
        likes: 95,
        featured: false,
      },
    ];

    setArticles(mockArticles);
    setFilteredArticles(mockArticles);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = articles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.bookTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      );
    }

    // Sort
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.views - a.views);
        break;
      case "most-liked":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case "most-commented":
        filtered.sort((a, b) => b.comments - a.comments);
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.publishDate).getTime() -
            new Date(b.publishDate).getTime()
        );
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
        );
        break;
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [articles, searchTerm, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  const categories = [
    "all",
    "Review Buku",
    "Analisis Sastra",
    "Tips Membaca",
    "Rekomendasi",
  ];

  const featuredArticles = articles
    .filter((article) => article.featured)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Artikel & Review Buku
          </h1>
          <p className="text-gray-600">
            Temukan review, analisis, dan rekomendasi buku terbaik dari
            komunitas pembaca Indonesia
          </p>
        </div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-blue-600" />
              Artikel Pilihan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <Card
                  key={article.id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    {article.bookImage && (
                      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <img
                          src={article.bookImage || "/buku.jpg"}
                          alt={article.bookTitle}
                          className="h-32 w-24 object-cover rounded shadow-lg"
                        />
                      </div>
                    )}
                    <Badge className="absolute top-4 left-4 bg-yellow-500">
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="secondary">{article.category}</Badge>
                      {article.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{article.rating}</span>
                        </div>
                      )}
                    </div>
                    <Link href={`/articles/${article.id}`}>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {article.views}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {article.comments}
                        </span>
                      </div>
                      <span>{article.readTime} min baca</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filter & Pencarian
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  Pencarian
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Cari artikel atau buku..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  Kategori
                </label>
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

              {/* Sort */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  Urutkan
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="oldest">Terlama</SelectItem>
                    <SelectItem value="popular">Terpopuler</SelectItem>
                    <SelectItem value="most-liked">Paling Disukai</SelectItem>
                    <SelectItem value="most-commented">
                      Paling Banyak Komentar
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Write Article CTA */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Tulis Artikel Anda
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  Bagikan review dan pemikiran Anda tentang buku favorit
                </p>
                <Button size="sm" className="w-full" asChild>
                  <Link href="/articles/write">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Tulis Artikel
                  </Link>
                </Button>
              </div>
            </Card>
          </div>

          {/* Articles Grid */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Menampilkan {startIndex + 1}-
                {Math.min(endIndex, filteredArticles.length)} dari{" "}
                {filteredArticles.length} artikel
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentArticles.map((article) => (
                <Card
                  key={article.id}
                  className="group hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="secondary">{article.category}</Badge>
                      {article.rating && (
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm ml-1">{article.rating}</span>
                        </div>
                      )}
                    </div>

                    <Link href={`/articles/${article.id}`}>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    {article.bookTitle && (
                      <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 rounded">
                        <BookOpen className="h-4 w-4 text-gray-500" />
                        <div className="text-sm">
                          <p className="font-medium">{article.bookTitle}</p>
                          <p className="text-gray-500">{article.bookAuthor}</p>
                        </div>
                      </div>
                    )}

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={article.author.avatar || "/buku.jpg"}
                        />
                        <AvatarFallback>
                          {article.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{article.author.name}</p>
                        <p className="text-gray-500">{article.author.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {article.views}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {article.comments}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(article.publishDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
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
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada artikel ditemukan
                </h3>
                <p className="text-gray-600 mb-4">
                  Coba ubah filter pencarian atau kata kunci Anda
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setSortBy("newest");
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
