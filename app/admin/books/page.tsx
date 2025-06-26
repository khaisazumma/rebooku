"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface Book {
  _id: string;
  title: string;
  author: string;
  seller: { username: string; fullName: string };
  createdAt: string;
}

export default function AdminBooksPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user || !user.id || user.role !== "admin") {
      router.push("/login");
      return;
    }

    const fetchBooks = async () => {
      try {
        // Simulate API call to /api/admin/books
        const mockData = {
          books: [
            {
              _id: "1",
              title: "Book Title",
              author: "Author Name",
              seller: { username: "seller1", fullName: "Seller One" },
              createdAt: "2025-06-20",
            },
          ],
          totalPages: 1,
        };
        setBooks(mockData.books);
        setTotalPages(mockData.totalPages);
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat daftar buku.",
          variant: "destructive",
        });
      }
    };

    fetchBooks();
  }, [user, router, toast, search, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/books?search=${encodeURIComponent(search)}&page=1`);
  };

  const handleDelete = async (bookId: string) => {
    try {
      // Simulate API call to /api/admin/books/:id/delete
      setBooks(books.filter((b) => b._id !== bookId));
      toast({
        title: "Buku dihapus",
        description: "Buku telah berhasil dihapus.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus buku.",
        variant: "destructive",
      });
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Buku</h1>
            <p className="text-sm text-gray-600">
              Lihat dan kelola daftar buku
            </p>
          </div>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Buku</CardTitle>
            <CardDescription>
              Cari buku berdasarkan judul atau penulis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Cari buku..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
                <Button type="submit">Cari</Button>
              </div>
            </form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Penjual</TableHead>
                  <TableHead>Ditambahkan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((b) => (
                  <TableRow key={b._id}>
                    <TableCell>{b.title}</TableCell>
                    <TableCell>{b.author}</TableCell>
                    <TableCell>{b.seller.fullName}</TableCell>
                    <TableCell>
                      {new Date(b.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(b._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                Halaman {currentPage} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() =>
                    router.push(
                      `/admin/books?search=${encodeURIComponent(search)}&page=${
                        currentPage - 1
                      }`
                    )
                  }
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    router.push(
                      `/admin/books?search=${encodeURIComponent(search)}&page=${
                        currentPage + 1
                      }`
                    )
                  }
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
