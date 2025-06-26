"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2 } from "lucide-react";

interface Article {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminArticlesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/articles");
      if (!response.ok) throw new Error("Gagal mengambil artikel");
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat daftar artikel. Menggunakan data contoh.",
        variant: "destructive",
      });
      setArticles([
        {
          _id: "1",
          title: "Artikel Contoh 1",
          content: "Ini adalah artikel contoh pertama.",
          author: "Admin",
          createdAt: "2025-06-20",
          updatedAt: "2025-06-20",
        },
        {
          _id: "2",
          title: "Artikel Contoh 2",
          content: "Ini adalah artikel contoh kedua.",
          author: "Admin",
          createdAt: "2025-06-21",
          updatedAt: "2025-06-21",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Gagal menambah artikel");
      toast({
        title: "Berhasil",
        description: "Artikel berhasil ditambahkan.",
      });
      setIsAddOpen(false);
      setFormData({ title: "", content: "", author: "" });
      await fetchArticles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambah artikel.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/articles/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Gagal mengedit artikel");
      toast({
        title: "Berhasil",
        description: "Artikel berhasil diperbarui.",
      });
      setIsEditOpen(false);
      setFormData({ title: "", content: "", author: "" });
      setEditId(null);
      await fetchArticles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengedit artikel.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Gagal menghapus artikel");
      toast({
        title: "Berhasil",
        description: "Artikel berhasil dihapus.",
      });
      await fetchArticles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus artikel.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (article: Article) => {
    setFormData({
      title: article.title,
      content: article.content,
      author: article.author,
    });
    setEditId(article._id);
    setIsEditOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-xl font-semibold">
              📚 Daftar Artikel
            </CardTitle>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-white hover:bg-primary/90">
                  + Tambah Artikel
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Artikel Baru</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddArticle} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Judul</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Konten</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Penulis</Label>
                    <Input
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Menyimpan..." : "Simpan"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Penulis</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Memuat...
                      </TableCell>
                    </TableRow>
                  ) : articles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Tidak ada artikel ditemukan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    articles.map((article) => (
                      <TableRow key={article._id}>
                        <TableCell>{article.title}</TableCell>
                        <TableCell>{article.author}</TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {new Date(article.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openEditDialog(article)}
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteArticle(article._id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Dialog Edit */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Artikel</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditArticle} className="space-y-4">
              <div>
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Konten</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  rows={5}
                />
              </div>
              <div>
                <Label htmlFor="author">Penulis</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}
