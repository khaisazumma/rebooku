"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Package, Truck, CheckCircle, AlertCircle, Clock, MapPin, CreditCard } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  date: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: number
  products: {
    id: string
    title: string
    quantity: number
    price: number
    image: string
    seller: string
  }[]
  shipping: {
    method: string
    cost: number
    address: string
    recipient: string
    phone: string
    trackingNumber?: string
    estimatedDelivery?: string
  }
  payment: {
    method: string
    status: "paid" | "pending" | "failed"
    date?: string
  }
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for the specific order
    const mockOrder: Order = {
      id: params.id as string,
      date: "2024-05-28",
      total: 150000,
      status: "shipped",
      items: 2,
      products: [
        {
          id: "1",
          title: "Atomic Habits",
          quantity: 1,
          price: 75000,
          image: "/placeholder.svg?height=80&width=60",
          seller: "BookStore Jakarta",
        },
        {
          id: "2",
          title: "Sapiens",
          quantity: 1,
          price: 75000,
          image: "/placeholder.svg?height=80&width=60",
          seller: "Toko Buku Bandung",
        },
      ],
      shipping: {
        method: "JNE Regular",
        cost: 15000,
        address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta, 10220",
        recipient: "Ahmad Rizki",
        phone: "081234567890",
        trackingNumber: "JNE123456789",
        estimatedDelivery: "2024-06-02",
      },
      payment: {
        method: "Bank Transfer - BCA",
        status: "paid",
        date: "2024-05-28",
      },
    }

    // Simulate API call
    setTimeout(() => {
      setOrder(mockOrder)
      setLoading(false)
    }, 500)
  }, [params.id])

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Menunggu Pembayaran"
      case "processing":
        return "Diproses"
      case "shipped":
        return "Dikirim"
      case "delivered":
        return "Diterima"
      case "cancelled":
        return "Dibatalkan"
      default:
        return status
    }
  }

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />
      case "processing":
        return <Package className="h-6 w-6 text-blue-500" />
      case "shipped":
        return <Truck className="h-6 w-6 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-6 w-6 text-red-500" />
      default:
        return <Package className="h-6 w-6 text-gray-500" />
    }
  }

  const handleConfirmReceipt = () => {
    toast({
      title: "Pesanan dikonfirmasi",
      description: "Terima kasih telah mengonfirmasi penerimaan pesanan Anda",
    })

    // Update order status
    if (order) {
      setOrder({ ...order, status: "delivered" })
    }
  }

  const handleCancelOrder = () => {
    toast({
      title: "Pesanan dibatalkan",
      description: "Pesanan Anda telah dibatalkan",
    })

    // Update order status
    if (order) {
      setOrder({ ...order, status: "cancelled" })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
        <div className="text-center py-12">Loading...</div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-2" />
            <h3 className="text-lg font-medium">Pesanan tidak ditemukan</h3>
            <p className="text-gray-500 mb-4">Pesanan yang Anda cari tidak ditemukan</p>
            <Button asChild>
              <Link href="/dashboard/orders">Lihat Semua Pesanan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Pesanan {order.id}</h1>
          <p className="text-muted-foreground">Tanggal pesanan: {new Date(order.date).toLocaleDateString("id-ID")}</p>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center space-x-2">
          <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
          {order.status === "shipped" && (
            <Button size="sm" onClick={handleConfirmReceipt}>
              Konfirmasi Penerimaan
            </Button>
          )}
          {order.status === "pending" && (
            <Button size="sm" variant="outline" onClick={handleCancelOrder}>
              Batalkan Pesanan
            </Button>
          )}
        </div>
      </div>

      {/* Order Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            {getStatusIcon(order.status)}
            <span className="ml-2">Status Pesanan: {getStatusText(order.status)}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="flex items-center mb-8">
              <div
                className={`w-1/4 flex flex-col items-center ${
                  ["pending", "processing", "shipped", "delivered"].includes(order.status)
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    ["pending", "processing", "shipped", "delivered"].includes(order.status)
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                </div>
                <p className="text-xs mt-2 text-center">Pembayaran</p>
              </div>

              <div
                className={`w-1/4 flex flex-col items-center ${
                  ["processing", "shipped", "delivered"].includes(order.status) ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    ["processing", "shipped", "delivered"].includes(order.status) ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <Package className="h-5 w-5" />
                </div>
                <p className="text-xs mt-2 text-center">Diproses</p>
              </div>

              <div
                className={`w-1/4 flex flex-col items-center ${
                  ["shipped", "delivered"].includes(order.status) ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    ["shipped", "delivered"].includes(order.status) ? "bg-blue-100" : "bg-gray-100"
                  }`}
                >
                  <Truck className="h-5 w-5" />
                </div>
                <p className="text-xs mt-2 text-center">Dikirim</p>
              </div>

              <div
                className={`w-1/4 flex flex-col items-center ${
                  order.status === "delivered" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div className={`rounded-full p-2 ${order.status === "delivered" ? "bg-blue-100" : "bg-gray-100"}`}>
                  <CheckCircle className="h-5 w-5" />
                </div>
                <p className="text-xs mt-2 text-center">Diterima</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
              <div
                className="h-full bg-blue-600"
                style={{
                  width:
                    order.status === "pending"
                      ? "12.5%"
                      : order.status === "processing"
                        ? "37.5%"
                        : order.status === "shipped"
                          ? "62.5%"
                          : order.status === "delivered"
                            ? "100%"
                            : "0%",
                }}
              ></div>
            </div>
          </div>

          {order.status === "shipped" && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">Informasi Pengiriman</h4>
              <p className="text-sm">
                Pesanan Anda sedang dalam perjalanan. Nomor resi: <strong>{order.shipping.trackingNumber}</strong>
              </p>
              <p className="text-sm mt-1">
                Estimasi tiba: {new Date(order.shipping.estimatedDelivery || "").toLocaleDateString("id-ID")}
              </p>
              <Button variant="link" className="p-0 h-auto text-sm mt-2">
                Lacak Pengiriman
              </Button>
            </div>
          )}

          {order.status === "cancelled" && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                Pesanan Dibatalkan
              </h4>
              <p className="text-sm">
                Pesanan ini telah dibatalkan. Jika Anda sudah melakukan pembayaran, dana akan dikembalikan dalam 3-5
                hari kerja.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Produk ({order.items})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.products.map((product) => (
              <div key={product.id} className="flex items-center space-x-4">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{product.title}</h4>
                  <p className="text-sm text-gray-500">Penjual: {product.seller}</p>
                  <p className="text-sm text-gray-500">
                    {product.quantity} x Rp {product.price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">Rp {(product.quantity * product.price).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipping & Payment Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Informasi Pengiriman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-medium">{order.shipping.recipient}</p>
                <p className="text-sm text-gray-500">{order.shipping.phone}</p>
              </div>
              <p className="text-sm">{order.shipping.address}</p>
              <Separator />
              <div>
                <p className="text-sm">
                  <span className="font-medium">Metode Pengiriman:</span> {order.shipping.method}
                </p>
                {order.shipping.trackingNumber && (
                  <p className="text-sm">
                    <span className="font-medium">Nomor Resi:</span> {order.shipping.trackingNumber}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Informasi Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="font-medium">Metode Pembayaran</p>
                <p className="text-sm">{order.payment.method}</p>
              </div>
              <div>
                <p className="font-medium">Status Pembayaran</p>
                <Badge
                  className={
                    order.payment.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : order.payment.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {order.payment.status === "paid"
                    ? "Lunas"
                    : order.payment.status === "pending"
                      ? "Menunggu Pembayaran"
                      : "Gagal"}
                </Badge>
              </div>
              {order.payment.date && (
                <div>
                  <p className="font-medium">Tanggal Pembayaran</p>
                  <p className="text-sm">{new Date(order.payment.date).toLocaleDateString("id-ID")}</p>
                </div>
              )}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">
                    Rp{" "}
                    {order.products
                      .reduce((sum, product) => sum + product.price * product.quantity, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Biaya Pengiriman</span>
                  <span className="text-sm">Rp {order.shipping.cost.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>Rp {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/dashboard/orders">Kembali ke Daftar Pesanan</Link>
        </Button>
        <Button variant="outline">Hubungi Penjual</Button>
      </div>
    </div>
  )
}
