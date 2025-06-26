"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
        <p className="text-gray-600 mb-8">
          Kami siap membantu Anda dengan pertanyaan atau kebutuhan terkait
          platform Rebooku. Silakan hubungi kami melalui salah satu metode di
          bawah ini.
        </p>

        {/* Informasi Kontak */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-blue-600" />
              Informasi Kontak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-gray-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">info@rebooku.com</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Kirim pertanyaan Anda kapan saja, kami akan membalas dalam
                    24 jam.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Phone className="h-6 w-6 text-gray-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Telepon</h3>
                  <p className="text-gray-600">+62 21 1234 5678</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Tersedia Senin-Jumat, 09:00-17:00 WIB.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-gray-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Alamat</h3>
                  <p className="text-gray-600">Jakarta, Indonesia</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Kantor pusat kami berlokasi di ibu kota.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pesan Tambahan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Butuh Bantuan Lebih Lanjut?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Tim dukungan kami berkomitmen untuk memberikan pengalaman terbaik
              bagi Anda. Jangan ragu untuk menghubungi kami terkait pertanyaan
              tentang penjualan, pembelian, atau fitur platform lainnya.
            </p>
            <div className="mt-4">
              <a
                href="/seller-guide"
                className="text-blue-600 hover:underline text-sm"
              >
                Lihat Panduan Penjual untuk tips menjual
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
