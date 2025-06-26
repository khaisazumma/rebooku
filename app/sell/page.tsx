"use client";

import type React from "react";

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  BookOpen,
  Camera,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface BookForm {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishYear: string;
  pages: string;
  language: string;
  category: string;
  condition: string;
  description: string;
  price: string;
  originalPrice: string;
  weight: string;
  dimensions: string;
  images: string[];
  tags: string[];
  agreeTerms: boolean;
}

export default function SellBookPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [formData, setFormData] = useState<BookForm>({
    title: "",
    author: "",
    isbn: "",
    publisher: "",
    publishYear: "",
    pages: "",
    language: "Bahasa Indonesia",
    category: "",
    condition: "",
    description: "",
    price: "",
    originalPrice: "",
    weight: "",
    dimensions: "",
    images: [],
    tags: [],
    agreeTerms: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTag, setNewTag] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const categories = [
    "Novel Indonesia",
    "Sastra Indonesia",
    "Sejarah Indonesia",
    "Biografi",
    "Pendidikan",
    "Agama & Spiritual",
    "Bisnis & Ekonomi",
    "Teknologi",
    "Kesehatan",
    "Psikologi",
    "Seni & Budaya",
    "Anak-anak",
    "Remaja",
    "Komik & Manga",
    "Lainnya",
  ];

  const conditions = [
    {
      value: "baru",
      label: "Baru",
      description: "Masih dalam kondisi sempurna, belum pernah dibaca",
    },
    {
      value: "sangat-baik",
      label: "Sangat Baik",
      description: "Sedikit bekas baca, tidak ada kerusakan",
    },
    {
      value: "baik",
      label: "Baik",
      description: "Ada bekas baca ringan, kondisi masih bagus",
    },
    {
      value: "cukup",
      label: "Cukup",
      description: "Ada bekas baca yang terlihat, mungkin ada lipatan kecil",
    },
    {
      value: "kurang",
      label: "Kurang Baik",
      description: "Banyak bekas baca, ada kerusakan ringan",
    },
  ];

  const languages = [
    "Bahasa Indonesia",
    "Bahasa Inggris",
    "Bahasa Jawa",
    "Bahasa Sunda",
    "Bahasa Batak",
    "Bahasa Minang",
    "Bahasa Arab",
    "Lainnya",
  ];

  const handleInputChange = (
    field: keyof BookForm,
    value: string | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Simulate image upload - in real app, upload to cloud storage
      const newImages = Array.from(files).map(
        (file, index) =>
          `/placeholder.svg?height=200&width=150&text=Book${
            formData.images.length + index + 1
          }`
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages].slice(0, 5), // Max 5 images
      }));

      toast({
        title: "Gambar berhasil diunggah",
        description: `${newImages.length} gambar telah ditambahkan`,
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (
      newTag.trim() &&
      !formData.tags.includes(newTag.trim()) &&
      formData.tags.length < 10
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.title &&
          formData.author &&
          formData.category &&
          formData.condition
        );
      case 2:
        return (
          formData.description && formData.price && formData.images.length > 0
        );
      case 3:
        return formData.agreeTerms;
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    } else {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon setujui syarat dan ketentuan",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create book object
      const newBook = {
        id: Date.now().toString(),
        ...formData,
        sellerId: user?.id,
        sellerName: user?.name,
        dateAdded: new Date().toISOString(),
        status: "pending", // pending, active, sold
        views: 0,
      };

      // Save to localStorage (in real app, this would be API call)
      const existingBooks = JSON.parse(
        localStorage.getItem("rebooku_my_books") || "[]"
      );
      existingBooks.unshift(newBook);
      localStorage.setItem("rebooku_my_books", JSON.stringify(existingBooks));

      toast({
        title: "Buku berhasil ditambahkan!",
        description:
          "Buku Anda sedang dalam proses review dan akan segera dipublikasikan",
      });

      router.push("/dashboard/my-books");
    } catch (error) {
      toast({
        title: "Gagal menambahkan buku",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  useEffect(() => {
    if (editId && user) {
      // Load book data for editing
      const savedBooks = localStorage.getItem(`rebooku_my_books_${user.id}`);
      if (savedBooks) {
        const books = JSON.parse(savedBooks);
        const bookToEdit = books.find((book: any) => book.id === editId);
        if (bookToEdit) {
          // Populate form with existing book data
          setFormData({
            title: bookToEdit.title,
            author: bookToEdit.author,
            isbn: bookToEdit.isbn || "",
            publisher: bookToEdit.publisher || "",
            publishYear: bookToEdit.publishYear?.toString() || "",
            pages: bookToEdit.pages?.toString() || "",
            category: bookToEdit.category,
            condition: bookToEdit.condition,
            price: bookToEdit.price.toString(),
            originalPrice: bookToEdit.originalPrice.toString(),
            description: bookToEdit.description,
            weight: bookToEdit.weight || "",
            dimensions: bookToEdit.dimensions || "",
            language: bookToEdit.language || "Bahasa Indonesia",
            tags: bookToEdit.tags || [],
            images: bookToEdit.images || [],
            agreeTerms: false,
          });
        }
      }
    }
  }, [editId, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {editId ? "Edit Buku" : "Jual Buku Anda"}
          </h1>
          <p className="text-gray-600">
            Bagikan koleksi buku Anda dengan pembaca lain di seluruh Indonesia
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-medium">{step}</span>
                  )}
                </div>
                <div className="ml-4 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step === 1 && "Informasi Buku"}
                    {step === 2 && "Detail & Harga"}
                    {step === 3 && "Review & Publikasi"}
                  </p>
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Informasi Dasar Buku
              </CardTitle>
              <CardDescription>
                Masukkan informasi dasar tentang buku yang akan Anda jual
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Buku *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Contoh: Laskar Pelangi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Penulis *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) =>
                      handleInputChange("author", e.target.value)
                    }
                    placeholder="Contoh: Andrea Hirata"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="isbn">ISBN (Opsional)</Label>
                  <Input
                    id="isbn"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange("isbn", e.target.value)}
                    placeholder="978-xxx-xxx-xxx-x"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="publisher">Penerbit</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={(e) =>
                      handleInputChange("publisher", e.target.value)
                    }
                    placeholder="Contoh: Bentang Pustaka"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="publishYear">Tahun Terbit</Label>
                  <Input
                    id="publishYear"
                    value={formData.publishYear}
                    onChange={(e) =>
                      handleInputChange("publishYear", e.target.value)
                    }
                    placeholder="2024"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pages">Jumlah Halaman</Label>
                  <Input
                    id="pages"
                    value={formData.pages}
                    onChange={(e) => handleInputChange("pages", e.target.value)}
                    placeholder="320"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Bahasa *</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) =>
                      handleInputChange("language", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Kondisi Buku *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) =>
                      handleInputChange("condition", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kondisi" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem
                          key={condition.value}
                          value={condition.value}
                        >
                          <div>
                            <div className="font-medium">{condition.label}</div>
                            <div className="text-xs text-gray-500">
                              {condition.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weight">Berat (gram)</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange("weight", e.target.value)
                    }
                    placeholder="400"
                    type="number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensi (cm)</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) =>
                      handleInputChange("dimensions", e.target.value)
                    }
                    placeholder="14 x 21 x 2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Details & Pricing */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2" />
                  Foto Buku
                </CardTitle>
                <CardDescription>
                  Unggah foto buku Anda (minimal 1, maksimal 5 foto)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-900 mb-2">
                        Unggah Foto Buku
                      </p>
                      <p className="text-sm text-gray-500">
                        Klik untuk memilih foto atau drag & drop di sini
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Format: JPG, PNG. Ukuran maksimal: 5MB per foto
                      </p>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Book ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2 bg-blue-500">
                              Foto Utama
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Tips Foto yang Baik:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Gunakan pencahayaan yang cukup</li>
                          <li>
                            • Foto cover depan, belakang, dan bagian dalam
                          </li>
                          <li>• Tunjukkan kondisi buku dengan jelas</li>
                          <li>• Hindari foto yang buram atau gelap</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deskripsi & Harga</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Buku *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    placeholder="Ceritakan tentang buku ini, kondisinya, mengapa Anda menjualnya, dll."
                    rows={5}
                  />
                  <p className="text-xs text-gray-500">
                    Deskripsi yang detail akan membantu pembeli memahami kondisi
                    buku
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Harga Jual (Rp) *</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange("price", e.target.value)
                      }
                      placeholder="75000"
                      type="number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Harga Asli (Rp)</Label>
                    <Input
                      id="originalPrice"
                      value={formData.originalPrice}
                      onChange={(e) =>
                        handleInputChange("originalPrice", e.target.value)
                      }
                      placeholder="120000"
                      type="number"
                    />
                    <p className="text-xs text-gray-500">
                      Harga buku saat baru untuk menunjukkan penghematan
                    </p>
                  </div>
                </div>

                {/* Price Calculation */}
                {formData.price && formData.originalPrice && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-800">
                        Penghematan untuk pembeli:
                      </span>
                      <span className="font-medium text-green-900">
                        {Math.round(
                          (1 -
                            Number.parseInt(formData.price) /
                              Number.parseInt(formData.originalPrice)) *
                            100
                        )}
                        % (Rp{" "}
                        {(
                          Number.parseInt(formData.originalPrice) -
                          Number.parseInt(formData.price)
                        ).toLocaleString()}
                        )
                      </span>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tag Buku (Opsional)</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Tambah tag..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      disabled={formData.tags.length >= 10}
                    >
                      Tambah
                    </Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center space-x-1"
                        >
                          <span>{tag}</span>
                          <button onClick={() => removeTag(tag)}>
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Tag membantu pembeli menemukan buku Anda (maksimal 10 tag)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Review & Terms */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Informasi Buku</CardTitle>
                <CardDescription>
                  Periksa kembali semua informasi sebelum mempublikasikan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Book Preview */}
                  <div className="border rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      {formData.images[0] && (
                        <img
                          src={formData.images[0] || "/placeholder.svg"}
                          alt={formData.title}
                          className="w-24 h-32 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{formData.title}</h3>
                        <p className="text-gray-600">oleh {formData.author}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge>{formData.category}</Badge>
                          <Badge variant="outline">
                            {
                              conditions.find(
                                (c) => c.value === formData.condition
                              )?.label
                            }
                          </Badge>
                        </div>
                        <div className="mt-3">
                          <span className="text-2xl font-bold text-blue-600">
                            Rp{" "}
                            {Number.parseInt(formData.price).toLocaleString()}
                          </span>
                          {formData.originalPrice && (
                            <span className="text-lg text-gray-400 line-through ml-2">
                              Rp{" "}
                              {Number.parseInt(
                                formData.originalPrice
                              ).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-700">
                        {formData.description}
                      </p>
                    </div>
                  </div>

                  {/* Book Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Detail Buku</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Penerbit:</span>
                          <span>{formData.publisher || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tahun Terbit:</span>
                          <span>{formData.publishYear || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Halaman:</span>
                          <span>{formData.pages || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bahasa:</span>
                          <span>{formData.language}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Berat:</span>
                          <span>
                            {formData.weight ? `${formData.weight}g` : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Dimensi:</span>
                          <span>{formData.dimensions || "-"}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Informasi Penjualan</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Penjual:</span>
                          <span>{user?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kondisi:</span>
                          <span>
                            {
                              conditions.find(
                                (c) => c.value === formData.condition
                              )?.label
                            }
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Foto:</span>
                          <span>{formData.images.length} foto</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tag:</span>
                          <span>{formData.tags.length} tag</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>Syarat & Ketentuan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-sm space-y-2">
                    <h4 className="font-medium">
                      Dengan menjual buku di Rebooku, Anda menyetujui:
                    </h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>
                        • Informasi yang diberikan adalah benar dan akurat
                      </li>
                      <li>• Buku yang dijual adalah milik Anda sendiri</li>
                      <li>
                        • Kondisi buku sesuai dengan deskripsi yang diberikan
                      </li>
                      <li>
                        • Anda akan mengirim buku dalam waktu 2x24 jam setelah
                        pembayaran
                      </li>
                      <li>
                        • Rebooku berhak menolak atau menghapus listing yang
                        melanggar aturan
                      </li>
                      <li>• Komisi platform sebesar 5% dari harga jual</li>
                    </ul>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        handleInputChange("agreeTerms", checked as boolean)
                      }
                    />
                    <Label htmlFor="agreeTerms" className="text-sm">
                      Saya telah membaca dan menyetujui{" "}
                      <a
                        href="/terms"
                        className="text-blue-600 hover:underline"
                      >
                        Syarat & Ketentuan
                      </a>{" "}
                      serta{" "}
                      <a
                        href="/seller-guide"
                        className="text-blue-600 hover:underline"
                      >
                        Panduan Penjual
                      </a>
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 1}
          >
            Sebelumnya
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNextStep}>Selanjutnya</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Publikasikan Buku
                </>
              )}
            </Button>
          )}
        </div>

        {/* Help Section */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="font-medium mb-2">Butuh Bantuan?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Tim kami siap membantu Anda dalam proses penjualan buku
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" size="sm" asChild>
                  <a href="/seller-guide">Panduan Penjual</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/contact">Hubungi Kami</a>
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
