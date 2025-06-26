"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  Package,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface MyBook {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  image: string;
  condition: string;
  category: string;
  description: string;
  status: "draft" | "active" | "sold" | "inactive";
  dateAdded: string;
  views: number;
  likes: number;
  inquiries: number;
  isbn?: string;
  publisher?: string;
  publishYear?: number;
  pages?: number;
  weight?: string;
  tags: string[];
}

export default function MyBooksPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [books, setBooks] = useState<MyBook[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<MyBook[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Load books from localStorage or mock data
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    const savedBooks = localStorage.getItem(`rebooku_my_books_${user?.id}`);
    if (savedBooks) {
      const parsedBooks = JSON.parse(savedBooks);
      setBooks(parsedBooks);
      setFilteredBooks(parsedBooks);
    } else {
      const mockBooks: MyBook[] = [
        {
          id: "mb1",
          title: "Atomic Habits",
          author: "James Clear",
          price: 75000,
          originalPrice: 120000,
          image:
            "https://perpustakaan.ummi.ac.id/uploads/images/page_20241210_092700_600.jpg",
          condition: "Sangat Baik",
          category: "Self Help",
          description:
            "Buku tentang membangun kebiasaan baik. Kondisi sangat baik, tidak ada coretan.",
          status: "active",
          dateAdded: "2024-05-20",
          views: 45,
          likes: 12,
          inquiries: 8,
          isbn: "978-0735211292",
          publisher: "Avery",
          publishYear: 2018,
          pages: 320,
          weight: "400g",
          tags: ["self-help", "productivity", "habits"],
        },
        {
          id: "mb2",
          title: "The Psychology of Money",
          author: "Morgan Housel",
          price: 65000,
          originalPrice: 110000,
          image:
            "https://miro.medium.com/v2/resize:fit:1400/1*rQNN_T1ueoC3lJVxcNZEjg.jpeg",
          condition: "Baik",
          category: "Finance",
          description:
            "Buku tentang psikologi keuangan. Ada beberapa highlight dengan pensil.",
          status: "active",
          dateAdded: "2024-05-15",
          views: 32,
          likes: 8,
          inquiries: 5,
          isbn: "978-0857197689",
          publisher: "Harriman House",
          publishYear: 2020,
          pages: 256,
          weight: "350g",
          tags: ["finance", "psychology", "money"],
        },
        {
          id: "mb3",
          title: "Clean Code",
          author: "Robert C. Martin",
          price: 95000,
          originalPrice: 150000,
          image:
            "https://miro.medium.com/v2/resize:fit:1126/1*_DQFYtGrTNHbi8QoUnFdqw.jpeg",
          condition: "Sangat Baik",
          category: "Programming",
          description: "Panduan menulis kode bersih. Kondisi seperti baru.",
          status: "sold",
          dateAdded: "2024-05-10",
          views: 67,
          likes: 15,
          inquiries: 12,
          isbn: "978-0132350884",
          publisher: "Prentice Hall",
          publishYear: 2008,
          pages: 464,
          weight: "600g",
          tags: ["programming", "software", "development"],
        },
        {
          id: "mb4",
          title: "Sapiens",
          author: "Yuval Noah Harari",
          price: 80000,
          originalPrice: 140000,
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwXm7atLHqJs63E6jkmFkPhh2a-RSGkQaxuA&s",
          condition: "Baik",
          category: "History",
          description:
            "Sejarah singkat umat manusia. Draft untuk review sebelum dipublikasi.",
          status: "draft",
          dateAdded: "2024-05-25",
          views: 0,
          likes: 0,
          inquiries: 0,
          isbn: "978-0062316097",
          publisher: "Harper",
          publishYear: 2015,
          pages: 443,
          weight: "500g",
          tags: ["history", "anthropology", "evolution"],
        },
      ];
      setBooks(mockBooks);
      setFilteredBooks(mockBooks);
      localStorage.setItem(
        `rebooku_my_books_${user?.id}`,
        JSON.stringify(mockBooks)
      );
    }
  }, [user, router]);

  // Filter and sort books
  useEffect(() => {
    let filtered = [...books];

    if (searchTerm) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((book) => book.status === statusFilter);
    }

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "views":
        filtered.sort((a, b) => b.views - a.views);
        break;
    }

    setFilteredBooks(filtered);
  }, [books, searchTerm, statusFilter, sortBy]);

  const getStatusColor = (status: MyBook["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: MyBook["status"]) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "sold":
        return "Terjual";
      case "draft":
        return "Draft";
      case "inactive":
        return "Tidak Aktif";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: MyBook["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "sold":
        return <Package className="h-4 w-4" />;
      case "draft":
        return <Clock className="h-4 w-4" />;
      case "inactive":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleDeleteBook = (bookId: string) => {
    const updatedBooks = books.filter((book) => book.id !== bookId);
    setBooks(updatedBooks);
    localStorage.setItem(
      `rebooku_my_books_${user?.id}`,
      JSON.stringify(updatedBooks)
    );
    toast({
      title: "Buku dihapus",
      description: "Buku telah dihapus dari daftar Anda",
    });
  };

  const handleStatusChange = (bookId: string, newStatus: MyBook["status"]) => {
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, status: newStatus } : book
    );
    setBooks(updatedBooks);
    localStorage.setItem(
      `rebooku_my_books_${user?.id}`,
      JSON.stringify(updatedBooks)
    );
    toast({
      title: "Status diperbarui",
      description: `Status buku telah diubah menjadi ${getStatusText(
        newStatus
      )}`,
    });
  };

  const activeBooks = books.filter((book) => book.status === "active").length;
  const soldBooks = books.filter((book) => book.status === "sold").length;
  const draftBooks = books.filter((book) => book.status === "draft").length;
  const totalViews = books.reduce((sum, book) => sum + book.views, 0);
  const totalInquiries = books.reduce((sum, book) => sum + book.inquiries, 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header and User Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Buku Saya</h1>
              <p className="text-sm text-gray-600">
                Kelola buku yang Anda jual di Rebooku
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/sell">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Buku Baru
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              icon: CheckCircle,
              label: "Aktif",
              value: activeBooks,
              color: "text-green-500",
            },
            {
              icon: Package,
              label: "Terjual",
              value: soldBooks,
              color: "text-blue-500",
            },
            {
              icon: Clock,
              label: "Draft",
              value: draftBooks,
              color: "text-yellow-500",
            },
            {
              icon: Eye,
              label: "Total Views",
              value: totalViews,
              color: "text-purple-500",
            },
            {
              icon: TrendingUp,
              label: "Inquiries",
              value: totalInquiries,
              color: "text-orange-500",
            },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-center space-x-3">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Books List with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Buku ({filteredBooks.length})</CardTitle>
            <CardDescription>
              Kelola dan pantau performa buku Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari buku..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
                className="w-full sm:max-w-[12rem]"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Terbaru</SelectItem>
                  <SelectItem value="oldest">Terlama</SelectItem>
                  <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                  <SelectItem value="price-low">Harga Terendah</SelectItem>
                  <SelectItem value="views">Views Terbanyak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tabs for Status */}
            <Tabs
              defaultValue="all"
              onValueChange={setStatusFilter}
              className="mb-6"
            >
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="active">Aktif</TabsTrigger>
                <TabsTrigger value="sold">Terjual</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="inactive">Tidak Aktif</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <BookList
                  books={filteredBooks}
                  handleDeleteBook={handleDeleteBook}
                  handleStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>
              <TabsContent value="active">
                <BookList
                  books={filteredBooks.filter(
                    (book) => book.status === "active"
                  )}
                  handleDeleteBook={handleDeleteBook}
                  handleStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>
              <TabsContent value="sold">
                <BookList
                  books={filteredBooks.filter((book) => book.status === "sold")}
                  handleDeleteBook={handleDeleteBook}
                  handleStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>
              <TabsContent value="draft">
                <BookList
                  books={filteredBooks.filter(
                    (book) => book.status === "draft"
                  )}
                  handleDeleteBook={handleDeleteBook}
                  handleStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>
              <TabsContent value="inactive">
                <BookList
                  books={filteredBooks.filter(
                    (book) => book.status === "inactive"
                  )}
                  handleDeleteBook={handleDeleteBook}
                  handleStatusChange={handleStatusChange}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  getStatusIcon={getStatusIcon}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface BookListProps {
  books: MyBook[];
  handleDeleteBook: (bookId: string) => void;
  handleStatusChange: (bookId: string, newStatus: MyBook["status"]) => void;
  getStatusColor: (status: MyBook["status"]) => string;
  getStatusText: (status: MyBook["status"]) => string;
  getStatusIcon: (status: MyBook["status"]) => JSX.Element;
}

const BookList: React.FC<BookListProps> = ({
  books,
  handleDeleteBook,
  handleStatusChange,
  getStatusColor,
  getStatusText,
  getStatusIcon,
}) => {
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <h3 className="text-lg font-medium">Tidak ada buku ditemukan</h3>
        <p className="text-gray-500 mb-4">
          Mulai jual buku pertama Anda di Rebooku
        </p>
        <Button asChild>
          <Link href="/sell">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Buku Pertama
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden">
          <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
            <img
              src={book.image || "/placeholder.svg?height=200&width=150"}
              alt={book.title}
              className="w-24 h-32 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {book.title}
                  </h3>
                  <p className="text-gray-600">{book.author}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(book.status)}>
                      {getStatusIcon(book.status)}
                      <span className="ml-1">{getStatusText(book.status)}</span>
                    </Badge>
                    <Badge variant="outline">{book.condition}</Badge>
                    <Badge variant="outline">{book.category}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">
                    Rp {book.price.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-400 line-through">
                    Rp {book.originalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 text-sm line-clamp-2">
                {book.description}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{book.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{book.inquiries} inquiries</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(book.dateAdded).toLocaleDateString("id-ID")}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {book.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/books/${book.id}`}>
                    <Eye className="mr-1 h-4 w-4" />
                    Lihat
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/sell?edit=${book.id}`}>
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                {book.status === "draft" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(book.id, "active")}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Publikasikan
                  </Button>
                )}
                {book.status === "active" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(book.id, "inactive")}
                  >
                    <AlertCircle className="mr-1 h-4 w-4" />
                    Nonaktifkan
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteBook(book.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Hapus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
