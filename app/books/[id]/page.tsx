"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  MessageCircle,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/back-button";

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
  isbn: string;
  publisher: string;
  publishYear: number;
  pages: number;
  language: string;
  weight: string;
  dimensions: string;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export default function BookDetailPage() {
  const params = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [activeTab, setActiveTab] = useState("description");
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Mock book data
    const mockBook: Book = {
      id: params.id as string,
      title: "Hujan",
      author: "Tere Liye",
      price: 58000,
      originalPrice: 98000,
      image:
        "https://image.idntimes.com/post/20211220/img-20211220-174140-c8f3bb774e08b33a08ce94ef88ba3c71-bae9af46ad2efa83ea7f91ce39e57ce8.JPG",
      rating: 4.5,
      reviews: 134,
      condition: "Baik",
      category: "Fantasi Indonesia",
      seller: "Fantasy Books ID",
      description:
        'Buku "Hujan" karya Tere Liye adalah novel bergenre fantasi dan fiksi ilmiah yang berlatar dunia masa depan saat perubahan iklim ekstrem melanda bumi. Mengisahkan Lail, seorang gadis muda yang kehilangan segalanya akibat bencana, dan perjalanannya menghadapi trauma serta menemukan makna cinta, harapan, dan keberanian dalam hidup. Cerita ini menyentuh, penuh aksi, dan reflektif, dengan pesan moral yang kuat tentang kemanusiaan dan pengorbanan.',
      isbn: "978-6020822126",
      publisher: "Gramedia Pustaka Utama",
      publishYear: 2016,
      pages: 320,
      language: "Bahasa Indonesia",
      weight: "350g",
      dimensions: "13.5 x 20 cm",
    };

    const mockReviews: Review[] = [
      {
        id: "1",
        userId: "1",
        userName: "Khaisa",
        userAvatar:
          "https://cdn.idntimes.com/content-images/post/20230515/download-5-f4d3db1dd7c8d1a792225674860b87ea.jpg",
        rating: 5,
        comment:
          "Buku yang sangat bagus! Kondisi masih sangat baik, hampir seperti baru. Isi bukunya juga sangat bermanfaat untuk membangun kebiasaan positif.",
        date: "2024-01-15",
        helpful: 12,
      },
      {
        id: "2",
        userId: "2",
        userName: "Zumma",
        userAvatar:
          "https://i.pinimg.com/236x/57/b1/d3/57b1d393a36cc5e036db8cb6d824511b.jpg",
        rating: 4,
        comment:
          "Pengiriman cepat dan buku sesuai deskripsi. Ada sedikit bekas lipatan di cover tapi tidak mengganggu. Konten bukunya excellent!",
        date: "2024-01-10",
        helpful: 8,
      },
      {
        id: "3",
        userId: "3",
        userName: "Salsabhila",
        userAvatar:
          "https://i.pinimg.com/236x/24/26/35/242635b2585b60832b26abeb5ed302f9.jpg",
        rating: 3,
        comment:
          "Recommended banget! Harga jauh lebih murah dari toko buku biasa tapi kualitas tetap bagus. Penjual responsif dan ramah.",
        date: "2024-01-05",
        helpful: 15,
      },
    ];

    setBook(mockBook);
    setReviews(mockReviews);

    // Check if book is in favorites
    const favorites = JSON.parse(
      localStorage.getItem("rebooku_favorites") || "[]"
    );
    setIsFavorite(favorites.includes(params.id));
  }, [params.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem("rebooku_favorites") || "[]"
    );
    const newFavorites = isFavorite
      ? favorites.filter((id: string) => id !== params.id)
      : [...favorites, params.id];

    localStorage.setItem("rebooku_favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);

    toast({
      title: isFavorite ? "Dihapus dari favorit" : "Ditambah ke favorit",
      description: isFavorite
        ? "Buku telah dihapus dari daftar favorit"
        : "Buku telah ditambahkan ke daftar favorit",
    });
  };

  const handleAddToCart = () => {
    if (!book) return;

    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: book.id,
        title: book.title,
        price: book.price,
        image: book.image,
        seller: book.seller,
      });
    }

    toast({
      title: "Ditambahkan ke keranjang",
      description: `${quantity} ${book.title} telah ditambahkan ke keranjang`,
    });
  };

  const handleSubmitReview = () => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Silakan login untuk memberikan review",
        variant: "destructive",
      });
      return;
    }

    if (!newReview.trim()) {
      toast({
        title: "Review kosong",
        description: "Silakan tulis review Anda",
        variant: "destructive",
      });
      return;
    }

    const review: Review = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || "/laskar pelangi.jpeg",
      rating: newRating,
      comment: newReview,
      date: new Date().toISOString().split("T")[0],
      helpful: 0,
    };

    setReviews((prev) => [review, ...prev]);
    setNewReview("");
    setNewRating(5);

    toast({
      title: "Review berhasil ditambahkan",
      description: "Terima kasih atas review Anda",
    });
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BackButton fallbackUrl="/books" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Book Image and Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="relative mb-4">
                  <img
                    src={book.image || "/laskar pelangi.jpeg"}
                    alt={book.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-500">
                    {book.condition}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleFavorite}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFavorite
                            ? "text-red-500 fill-current"
                            : "text-gray-600"
                        }`}
                      />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium">Jumlah:</label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Tambah ke Keranjang
                  </Button>

                  <Button variant="outline" className="w-full">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat Penjual
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Informasi Penjual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar>
                    <AvatarImage src="/laskar pelangi.jpeg" />
                    <AvatarFallback>BS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{book.seller}</p>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      4.9 (234 review)
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Jakarta Selatan
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Bergabung sejak 2020
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Penjual Terverifikasi
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Details */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {book.title}
              </h1>
              <p className="text-lg text-gray-600 mb-4">oleh {book.author}</p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-medium">{book.rating}</span>
                  <span className="ml-1 text-gray-600">
                    ({book.reviews} review)
                  </span>
                </div>
                <Badge variant="secondary">{book.category}</Badge>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  Rp {book.price.toLocaleString()}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  Rp {book.originalPrice.toLocaleString()}
                </span>
                <Badge className="bg-red-500">
                  {Math.round((1 - book.price / book.originalPrice) * 100)}% OFF
                </Badge>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: "description", label: "Deskripsi" },
                  { id: "specifications", label: "Spesifikasi" },
                  { id: "reviews", label: "Review" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "description" && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Deskripsi Buku
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {book.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {activeTab === "specifications" && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Spesifikasi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium">ISBN:</span>
                        <span className="ml-2 text-gray-600">{book.isbn}</span>
                      </div>
                      <div>
                        <span className="font-medium">Penerbit:</span>
                        <span className="ml-2 text-gray-600">
                          {book.publisher}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Tahun Terbit:</span>
                        <span className="ml-2 text-gray-600">
                          {book.publishYear}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Jumlah Halaman:</span>
                        <span className="ml-2 text-gray-600">
                          {book.pages} halaman
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Bahasa:</span>
                        <span className="ml-2 text-gray-600">
                          {book.language}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Berat:</span>
                        <span className="ml-2 text-gray-600">
                          {book.weight}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Dimensi:</span>
                        <span className="ml-2 text-gray-600">
                          {book.dimensions}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Kondisi:</span>
                        <span className="ml-2 text-gray-600">
                          {book.condition}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Add Review */}
                  {user && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Tulis Review</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Rating
                            </label>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setNewRating(star)}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    className={`h-6 w-6 ${
                                      star <= newRating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Review
                            </label>
                            <Textarea
                              value={newReview}
                              onChange={(e) => setNewReview(e.target.value)}
                              placeholder="Bagikan pengalaman Anda dengan buku ini..."
                              rows={4}
                            />
                          </div>
                          <Button onClick={handleSubmitReview}>
                            Kirim Review
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Reviews List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Review Pembeli ({reviews.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id}>
                            <div className="flex items-start space-x-4">
                              <Avatar>
                                <AvatarImage
                                  src={
                                    review.userAvatar || "/laskar pelangi.jpeg"
                                  }
                                />
                                <AvatarFallback>
                                  {review.userName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium">
                                    {review.userName}
                                  </span>
                                  <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= review.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {review.date}
                                  </span>
                                </div>
                                <p className="text-gray-700 mb-2">
                                  {review.comment}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <button className="hover:text-blue-600">
                                    👍 Membantu ({review.helpful})
                                  </button>
                                  <button className="hover:text-blue-600">
                                    Balas
                                  </button>
                                </div>
                              </div>
                            </div>
                            <Separator className="mt-4" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
