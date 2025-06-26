"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Minus, Plus, Trash2, ArrowRight, Tag } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)

  const shippingCost = 15000
  const finalTotal = total + shippingCost - discount

  const handleApplyPromo = () => {
    // Mock promo codes
    const promoCodes: { [key: string]: number } = {
      WELCOME10: 10000,
      SAVE20: 20000,
      NEWUSER: 15000,
    }

    if (promoCodes[promoCode.toUpperCase()]) {
      setDiscount(promoCodes[promoCode.toUpperCase()])
      toast({
        title: "Kode promo berhasil diterapkan!",
        description: `Anda mendapat diskon Rp ${promoCodes[promoCode.toUpperCase()].toLocaleString()}`,
      })
    } else {
      toast({
        title: "Kode promo tidak valid",
        description: "Silakan periksa kembali kode promo Anda",
        variant: "destructive",
      })
    }
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Keranjang dikosongkan",
      description: "Semua item telah dihapus dari keranjang",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Keranjang Belanja</h1>
          <p className="text-gray-600">Kelola item yang akan Anda beli</p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Item Keranjang ({items.length})</CardTitle>
                    <Button variant="outline" size="sm" onClick={handleClearCart}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Kosongkan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-500">Penjual: {item.seller}</p>
                          <p className="text-lg font-bold text-blue-600 mt-1">Rp {item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">Rp {(item.price * item.quantity).toLocaleString()}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Promo Code */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    Kode Promo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Masukkan kode promo"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button onClick={handleApplyPromo}>Terapkan</Button>
                  </div>
                  {discount > 0 && (
                    <div className="mt-2">
                      <Badge className="bg-green-100 text-green-800">
                        Diskon Rp {discount.toLocaleString()} diterapkan
                      </Badge>
                    </div>
                  )}
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="font-medium mb-2">Kode promo tersedia:</p>
                    <ul className="space-y-1">
                      <li>• WELCOME10 - Diskon Rp 10.000</li>
                      <li>• SAVE20 - Diskon Rp 20.000</li>
                      <li>• NEWUSER - Diskon Rp 15.000</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Ringkasan Pesanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} item)</span>
                      <span>Rp {total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Pengiriman</span>
                      <span>Rp {shippingCost.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Diskon</span>
                        <span>-Rp {discount.toLocaleString()}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>Rp {finalTotal.toLocaleString()}</span>
                    </div>

                    <div className="space-y-2 mt-6">
                      {user ? (
                        <Button className="w-full" asChild>
                          <Link href="/checkout">
                            Lanjut ke Pembayaran
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      ) : (
                        <div className="space-y-2">
                          <Button className="w-full" asChild>
                            <Link href="/login">
                              Login untuk Checkout
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          </Button>
                          <p className="text-xs text-gray-500 text-center">
                            Atau{" "}
                            <Link href="/register" className="text-blue-600 hover:underline">
                              daftar akun baru
                            </Link>
                          </p>
                        </div>
                      )}
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/books">Lanjut Belanja</Link>
                      </Button>
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Keuntungan Berbelanja di Rebooku:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>✓ Garansi uang kembali</li>
                        <li>✓ Pengiriman cepat & aman</li>
                        <li>✓ Customer service 24/7</li>
                        <li>✓ Buku berkualitas terjamin</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">Keranjang Anda kosong</h3>
              <p className="text-gray-600 mb-6">Belum ada item yang ditambahkan ke keranjang</p>
              <Button asChild>
                <Link href="/books">Mulai Belanja</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  )
}
