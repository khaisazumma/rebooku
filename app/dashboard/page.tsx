"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Heart,
  BookOpen,
  ShoppingCart,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  image: string;
  status: "active" | "sold" | "draft";
  dateAdded: string;
  views: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Mock data for recent orders
    const mockOrders: Order[] = [
      {
        id: "ORD-001",
        date: "2024-05-28",
        total: 150000,
        status: "delivered",
        items: 2,
      },
      {
        id: "ORD-002",
        date: "2024-05-20",
        total: 85000,
        status: "shipped",
        items: 1,
      },
      {
        id: "ORD-003",
        date: "2024-05-15",
        total: 210000,
        status: "processing",
        items: 3,
      },
    ];

    // Mock data for my books
    const mockBooks: Book[] = [
      {
        id: "1",
        title: "The Design of Everyday Things",
        author: "Don Norman",
        price: 95000,
        image: "/placeholder.svg?height=100&width=80",
        status: "active",
        dateAdded: "2024-05-10",
        views: 45,
      },
      {
        id: "2",
        title: "Eloquent JavaScript",
        author: "Marijn Haverbeke",
        price: 120000,
        image: "/placeholder.svg?height=100&width=80",
        status: "active",
        dateAdded: "2024-05-05",
        views: 32,
      },
    ];

    setRecentOrders(mockOrders);
    setMyBooks(mockBooks);

    // Get favorites count from localStorage
    const favorites = JSON.parse(
      localStorage.getItem("rebooku_favorites") || "[]"
    );
    setFavoriteCount(favorites.length);

    // Get cart count from localStorage
    const cart = JSON.parse(localStorage.getItem("rebooku_cart") || "[]");
    setCartCount(
      cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
    );
  }, []);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Menunggu Pembayaran";
      case "processing":
        return "Diproses";
      case "shipped":
        return "Dikirim";
      case "delivered":
        return "Diterima";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Selamat datang kembali, {user?.name}! Berikut adalah ringkasan
          aktivitas Anda.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Package className="h-10 w-10 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pesanan
                </p>
                <h3 className="text-2xl font-bold">{recentOrders.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Heart className="h-10 w-10 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Favorit
                </p>
                <h3 className="text-2xl font-bold">{favoriteCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-10 w-10 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Buku Dijual
                </p>
                <h3 className="text-2xl font-bold">{myBooks.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-10 w-10 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Keranjang
                </p>
                <h3 className="text-2xl font-bold">{cartCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Pesanan Terbaru</TabsTrigger>
          <TabsTrigger value="books">Buku Saya</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Pesanan Terbaru</CardTitle>
              <CardDescription>Daftar pesanan terbaru Anda</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{order.id}</h4>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          <span>
                            {new Date(order.date).toLocaleDateString("id-ID")}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{order.items} item</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          Rp {order.total.toLocaleString()}
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          asChild
                          className="p-0"
                        >
                          <Link href={`/dashboard/orders/${order.id}`}>
                            Detail
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">Belum ada pesanan</h3>
                  <p className="text-gray-500 mb-4">
                    Anda belum memiliki pesanan
                  </p>
                  <Button asChild>
                    <Link href="/books">Mulai Belanja</Link>
                  </Button>
                </div>
              )}

              {recentOrders.length > 0 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/orders">Lihat Semua Pesanan</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="books">
          <Card>
            <CardHeader>
              <CardTitle>Buku Saya</CardTitle>
              <CardDescription>Buku yang Anda jual di Rebooku</CardDescription>
            </CardHeader>
            <CardContent>
              {myBooks.length > 0 ? (
                <div className="space-y-4">
                  {myBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center p-4 border rounded-lg"
                    >
                      <img
                        src={book.image || "/placeholder.svg"}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded-md mr-4"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{book.title}</h4>
                        <p className="text-sm text-gray-500">{book.author}</p>
                        <div className="flex items-center space-x-4 mt-1 text-sm">
                          <span className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1 text-gray-500" />
                            {book.views} dilihat
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            {new Date(book.dateAdded).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-blue-600">
                          Rp {book.price.toLocaleString()}
                        </div>
                        <Badge
                          className={
                            book.status === "active"
                              ? "bg-green-100 text-green-800"
                              : book.status === "sold"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {book.status === "active"
                            ? "Aktif"
                            : book.status === "sold"
                            ? "Terjual"
                            : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">Belum ada buku</h3>
                  <p className="text-gray-500 mb-4">
                    Anda belum menjual buku apapun
                  </p>
                  <Button asChild>
                    <Link href="/sell">Jual Buku</Link>
                  </Button>
                </div>
              )}

              {myBooks.length > 0 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/my-books">Kelola Buku Saya</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Notifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 border rounded-lg bg-yellow-50">
              <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Verifikasi email Anda</h4>
                <p className="text-sm text-gray-600">
                  Silakan verifikasi email Anda untuk mengaktifkan semua fitur
                  Rebooku
                </p>
                <Button variant="link" className="p-0 h-auto text-sm">
                  Kirim ulang email verifikasi
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border rounded-lg">
              <Package className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Pesanan ORD-003 sedang diproses</h4>
                <p className="text-sm text-gray-600">
                  Pesanan Anda sedang diproses dan akan segera dikirim
                </p>
                <Button variant="link" className="p-0 h-auto text-sm" asChild>
                  <Link href="/dashboard/orders/ORD-003">Lihat detail</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
