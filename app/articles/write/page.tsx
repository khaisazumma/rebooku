"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Eye, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface Article {
  id: string;
  title: string;
  category: string;
  content: string;
  date: string;
  userId: string;
}

export default function WriteArticlePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categories = [
    "Ulasan Buku",
    "Tips Membaca",
    "Rekomendasi Buku",
    "Berita Marketplace",
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!user || !user.id) {
      router.push("/login");
    }
  }, [user, router]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { name: string; value: string }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.title || formData.title.length < 5) {
      toast({
        title: "Error",
        description: "Judul artikel harus diisi dan minimal 5 karakter.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    if (!formData.category) {
      toast({
        title: "Error",
        description: "Kategori artikel harus dipilih.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    if (!formData.content || formData.content.length < 20) {
      toast({
        title: "Error",
        description: "Isi artikel harus diisi dan minimal 20 karakter.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Save to localStorage
    const newArticle: Article = {
      id: `art${Date.now()}`,
      title: formData.title,
      category: formData.category,
      content: formData.content,
      date: new Date().toISOString().split("T")[0],
      userId: user?.id || "",
    };

    const existingArticles = JSON.parse(
      localStorage.getItem(`rebooku_articles_${user?.id}`) || "[]"
    ) as Article[];
    const updatedArticles = [...existingArticles, newArticle];
    localStorage.setItem(
      `rebooku_articles_${user?.id}`,
      JSON.stringify(updatedArticles)
    );

    toast({
      title: "Artikel disimpan",
      description:
        "Artikel Anda telah berhasil disimpan dan dapat dilihat di daftar artikel.",
    });

    setFormData({ title: "", category: "", content: "" });
    setIsSubmitting(false);
    router.push("/articles");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tulis Artikel
              </h1>
              <p className="text-sm text-gray-600">
                Tulis ulasan buku atau konten lain untuk dibagikan di Rebooku
              </p>
            </div>
          </div>
        </div>

        {/* Article Form */}
        <Card>
          <CardHeader>
            <CardTitle>Formulir Penulisan Artikel</CardTitle>
            <CardDescription>
              Isi detail artikel Anda dan pratinjau sebelum menyimpan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Judul Artikel</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Masukkan judul artikel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori Artikel</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        handleInputChange({ name: "category", value })
                      }
                    >
                      <SelectTrigger id="category" className="sm:max-w-[12rem]">
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Isi Artikel</Label>
                  <Tabs defaultValue="write">
                    <TabsList className="mb-4">
                      <TabsTrigger value="write">Tulis</TabsTrigger>
                      <TabsTrigger value="preview">Pratinjau</TabsTrigger>
                    </TabsList>
                    <TabsContent value="write">
                      <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="Tulis isi artikel Anda di sini (mendukung markdown sederhana)"
                        rows={10}
                        className="w-full"
                      />
                    </TabsContent>
                    <TabsContent value="preview">
                      <Card className="p-4 min-h-[200px] bg-gray-50">
                        <ReactMarkdown className="prose prose-sm max-w-none">
                          {formData.content ||
                            "Belum ada konten untuk dipratinjau."}
                        </ReactMarkdown>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData({ title: "", category: "", content: "" })
                  }
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Menyimpan..." : "Simpan Artikel"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
