"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Heart, Search, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

interface Book {
  id: string
  title: string
  author: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  condition: string
  seller: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])

  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    // Get favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem("rebooku_favorites") || "[]")
    setFavorites(savedFavorites)

    // Mock data for books
    const mockBooks: Book[] = [
      {
        id: "1",
        title: "Atomic Habits",
        author: "James Clear",
        price: 75000,
        originalPrice: 120000,
        image: "/placeholder.svg?height=200&width=150",
        rating: 4.8,
        reviews: 124,
        condition: "Sangat Baik",
        seller: "BookStore Jakarta",
      },
      {
        id: "2",
        title: "Sapiens",
        author: "Yuval Noah Harari",
        price: 85000,
        originalPrice: 150000,
        image: "/placeholder.svg?height=200&width=150",
        rating: 4.9,
        reviews: 89,
        condition: "Baik",
        seller: "Toko Buku Bandung",
      },
      {
        id: "3",
        title: "The Psychology of Money",
        author: "Morgan Housel",
        price: 65000,
        originalPrice: 110000,
        image: "/placeholder.svg?height=200&width=150",
        rating: 4.7,
        reviews: 156,
        condition: "Sangat Baik",
        seller: "ReadMore Store",
      },
    ]

    // Filter books that are in favorites
    const favoriteBooksList = mockBooks.filter((book) => savedFavorites.includes(book.id))
    setFavoriteBooks(favoriteBooksList)
    setFilteredBooks(favoriteBooksList)
  }, [])

  useEffect(() => {
    const filtered = favoriteBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredBooks(filtered)
  }, [favoriteBooks, searchTerm])

  const removeFavorite = (bookId: string) => {
    const newFavorites = favorites.filter((id) => id !== bookId)
    setFavorites(newFavorites)
    localStorage.setItem("rebooku_favorites", JSON.stringify(newFavorites))

    const newFavoriteBooks = favoriteBooks.filter((book) => book.id !== bookId)
    setFavoriteBooks(newFavoriteBooks)

    toast({
      title: "Dihapus dari favorit",
      description: "Buku telah dihapus dari daftar favorit Anda",
    })
  }

  const handleAddToCart = (book: Book) => {
    addToCart({
      id: book.id,
      title: book.title,
      price: book.price,
      image: book.image,
      seller: book.seller,
    })

    toast({
      title: "Ditambahkan ke keranjang",
      description: `${book.title} telah ditambahkan ke keranjang`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buku Favorit</h1>
        <p className="text-muted-foreground">Koleksi buku yang Anda sukai</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Favorit ({favoriteBooks.length})</CardTitle>
          <CardDescription>Buku-buku yang telah Anda tandai sebagai favorit</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari buku favorit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Books Grid */}
          {filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="group hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="relative mb-4">
                      <Link href={`/books/${book.id}`}>
                        <img
                          src={book.image || "/placeholder.svg"}
                          alt={book.title}
                          className="w-full h-48 object-cover rounded-md group-hover:scale-105 transition-transform"
                        />
                      </Link>
                      <Badge className="absolute top-2 left-2 bg-green-500">{book.condition}</Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => removeFavorite(book.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    <Link href={`/books/${book.id}`}>
                      <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {book.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>

                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Heart
                            key={star}
                            className={`h-3 w-3 ${
                              star <= Math.floor(book.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-1">
                        {book.rating} ({book.reviews} review)
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-blue-600">Rp {book.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-400 line-through ml-2">
                          Rp {book.originalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-3">Dijual oleh: {book.seller}</p>

                    <div className="flex space-x-2">
                      <Button className="flex-1" onClick={() => handleAddToCart(book)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Keranjang
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => removeFavorite(book.id)}>
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">
                {searchTerm ? "Tidak ada buku ditemukan" : "Belum ada buku favorit"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? "Coba ubah kata kunci pencarian Anda"
                  : "Mulai menambahkan buku ke favorit untuk melihatnya di sini"}
              </p>
              {searchTerm ? (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Reset Pencarian
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/books">Jelajahi Buku</Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
