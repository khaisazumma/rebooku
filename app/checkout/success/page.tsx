"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  Package,
  CreditCard,
  MapPin,
  Clock,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  date: string;
  items: any[];
  total: number;
  status: string;
  shipping: any;
  payment: any;
  notes?: string;
}

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!orderId) {
      router.push("/");
      return;
    }

    // Get order from localStorage
    const orders = JSON.parse(localStorage.getItem("rebooku_orders") || "[]");
    const foundOrder = orders.find((o: Order) => o.id === orderId);

    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      router.push("/");
    }

    setLoading(false);
  }, [orderId, router]);

  const getPaymentInstructions = () => {
    if (!order?.payment?.method) return null;

    const method = order.payment.method;

    if (method.type === "bank") {
      return (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            Instruksi Pembayaran
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>1. Transfer ke rekening berikut:</p>
            <div className="bg-white p-3 rounded border">
              <p className="font-medium">{method.name}</p>
              <p>No. Rekening: 1234567890</p>
              <p>Atas Nama: PT Rebooku Indonesia</p>
              <p className="font-medium">
                Jumlah: Rp {order.total.toLocaleString()}
              </p>
            </div>
            <p>2. Simpan bukti transfer</p>
            <p>3. Upload bukti transfer di halaman pesanan</p>
            <p>4. Pesanan akan diproses setelah pembayaran dikonfirmasi</p>
          </div>
        </div>
      );
    }

    if (method.type === "ewallet") {
      return (
        <div className="p-4 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-900 mb-2">
            Instruksi Pembayaran
          </h4>
          <div className="space-y-2 text-sm text-green-800">
            <p>1. Buka aplikasi {method.name}</p>
            <p>2. Scan QR Code atau masukkan nomor virtual account</p>
            <p>
              3. Konfirmasi pembayaran sebesar Rp {order.total.toLocaleString()}
            </p>
            <p>4. Pesanan akan otomatis diproses setelah pembayaran berhasil</p>
          </div>
        </div>
      );
    }

    if (method.type === "cod") {
      return (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-900 mb-2">
            Bayar di Tempat (COD)
          </h4>
          <div className="space-y-2 text-sm text-yellow-800">
            <p>1. Pesanan akan segera diproses</p>
            <p>2. Siapkan uang pas sebesar Rp {order.total.toLocaleString()}</p>
            <p>3. Bayar kepada kurir saat barang diterima</p>
            <p>4. Pastikan Anda berada di alamat pengiriman saat barang tiba</p>
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium">Pesanan tidak ditemukan</h3>
              <p className="text-gray-500 mb-4">
                Pesanan yang Anda cari tidak ditemukan
              </p>
              <Button asChild>
                <Link href="/">Kembali ke Beranda</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pesanan Berhasil Dibuat!
          </h1>
          <p className="text-gray-600">
            Terima kasih telah berbelanja di Rebooku. Pesanan Anda sedang
            diproses.
          </p>
        </div>

        {/* Order Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <CardTitle>Pesanan {order.id}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Dibuat pada{" "}
                  {new Date(order.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Badge className="mt-2 sm:mt-0">
                {order.status === "pending_payment"
                  ? "Menunggu Pembayaran"
                  : "Pending"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Item Pesanan
                </h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="text-sm">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-gray-500">
                        {item.quantity} x Rp {item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Alamat Pengiriman
                </h4>
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {order.shipping.address.fullName}
                  </p>
                  <p className="text-gray-600">
                    {order.shipping.address.phone}
                  </p>
                  <p className="text-gray-600">
                    {order.shipping.address.address},{" "}
                    {order.shipping.address.city}
                  </p>
                  <p className="text-gray-600">
                    {order.shipping.address.province}{" "}
                    {order.shipping.address.postalCode}
                  </p>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pembayaran
                </h4>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.payment.method.name}</p>
                  <p className="text-gray-600">
                    {order.payment.method.description}
                  </p>
                  <p className="font-medium text-lg">
                    Rp {order.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Order Summary */}
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total Pesanan</span>
              <span className="text-2xl font-bold text-blue-600">
                Rp {order.total.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Instructions */}
        {getPaymentInstructions()}

        {/* Next Steps */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Langkah Selanjutnya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.payment.method.type !== "cod" && (
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <p className="font-medium">Lakukan Pembayaran</p>
                    <p className="text-sm text-gray-600">
                      Selesaikan pembayaran sesuai instruksi di atas dalam 24
                      jam
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">
                    {order.payment.method.type !== "cod" ? "2" : "1"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">Pesanan Diproses</p>
                  <p className="text-sm text-gray-600">
                    Penjual akan memproses pesanan Anda setelah pembayaran
                    dikonfirmasi
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">
                    {order.payment.method.type !== "cod" ? "3" : "2"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">Barang Dikirim</p>
                  <p className="text-sm text-gray-600">
                    Anda akan mendapat notifikasi dan nomor resi pengiriman
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-blue-600">
                    {order.payment.method.type !== "cod" ? "4" : "3"}
                  </span>
                </div>
                <div>
                  <p className="font-medium">Barang Diterima</p>
                  <p className="text-sm text-gray-600">
                    Konfirmasi penerimaan barang dan berikan review
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild className="flex-1">
            <Link href={`/dashboard/orders/${order.id}`}>
              <Package className="h-4 w-4 mr-2" />
              Lihat Detail Pesanan
            </Link>
          </Button>

          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>

          <Button variant="outline" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Bagikan
          </Button>
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">Ingin berbelanja lagi?</p>
          <Button variant="outline" asChild>
            <Link href="/books">
              Lanjut Belanja
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
