"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, DollarSign, ListOrdered, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SellerGuidePage() {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Panduan Penjual
        </h1>
        <p className="text-gray-600 mb-8">
          Pelajari cara menjual produk Anda dengan sukses di platform kami.
          Ikuti panduan ini untuk memahami alur penjualan, tips menjual yang
          efektif, serta cara membuat foto dan harga yang menarik.
        </p>

        {/* Alur Penjualan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListOrdered className="h-5 w-5 mr-2 text-blue-600" />
              Alur Penjualan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>
                <span className="font-medium">Buat Akun dan Login</span>
                <p className="text-sm mt-1">
                  Daftar atau login ke akun Anda untuk mulai menjual. Pastikan
                  profil Anda lengkap untuk meningkatkan kepercayaan pembeli.
                </p>
              </li>
              <li>
                <span className="font-medium">Tambahkan Produk</span>
                <p className="text-sm mt-1">
                  Masukkan detail produk seperti judul, kategori, deskripsi, dan
                  harga. Unggah foto berkualitas untuk menarik perhatian.
                </p>
              </li>
              <li>
                <span className="font-medium">Review dan Publikasikan</span>
                <p className="text-sm mt-1">
                  Periksa kembali informasi produk Anda. Setelah disetujui,
                  produk akan tampil di platform.
                </p>
              </li>
              <li>
                <span className="font-medium">Komunikasi dengan Pembeli</span>
                <p className="text-sm mt-1">
                  Tanggapi pertanyaan pembeli dengan cepat dan ramah untuk
                  membangun kepercayaan.
                </p>
              </li>
              <li>
                <span className="font-medium">
                  Proses Pesanan dan Pengiriman
                </span>
                <p className="text-sm mt-1">
                  Setelah pembayaran dikonfirmasi, kirim produk dalam waktu 2x24
                  jam menggunakan jasa pengiriman yang disepakati.
                </p>
              </li>
              <li>
                <span className="font-medium">Terima Pembayaran</span>
                <p className="text-sm mt-1">
                  Dana akan ditransfer ke akun Anda setelah pembeli
                  mengkonfirmasi penerimaan barang.
                </p>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Cara Menjual yang Baik */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
              Cara Menjual yang Baik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-4 text-gray-700">
              <li>
                <span className="font-medium">Deskripsi Jujur dan Detail</span>
                <p className="text-sm mt-1">
                  Jelaskan kondisi produk dengan jujur, termasuk kekurangan apa
                  pun. Sertakan informasi seperti merek, ukuran, atau
                  spesifikasi.
                </p>
              </li>
              <li>
                <span className="font-medium">Harga Kompetitif</span>
                <p className="text-sm mt-1">
                  Riset harga pasar untuk produk serupa. Tetapkan harga yang
                  wajar untuk menarik pembeli tanpa merugikan diri sendiri.
                </p>
              </li>
              <li>
                <span className="font-medium">Respon Cepat</span>
                <p className="text-sm mt-1">
                  Balas pertanyaan pembeli dalam waktu kurang dari 24 jam untuk
                  membangun reputasi yang baik.
                </p>
              </li>
              <li>
                <span className="font-medium">Kemasan Aman</span>
                <p className="text-sm mt-1">
                  Gunakan kemasan yang melindungi produk selama pengiriman untuk
                  menghindari kerusakan.
                </p>
              </li>
              <li>
                <span className="font-medium">Gunakan Tag dan Kategori</span>
                <p className="text-sm mt-1">
                  Tambahkan tag seperti “original”, “bekas”, atau “diskon” untuk
                  membantu pembeli menemukan produk Anda.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Foto yang Menarik */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="h-5 w-5 mr-2 text-blue-600" />
              Membuat Foto yang Menarik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Foto adalah faktor utama yang menarik perhatian pembeli. Berikut
                tips untuk foto produk yang efektif:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  Gunakan pencahayaan alami atau lampu terang untuk menghindari
                  bayangan.
                </li>
                <li>
                  Ambil foto dari beberapa sudut, termasuk close-up untuk
                  menunjukkan detail.
                </li>
                <li>
                  Gunakan latar belakang polos (misalnya, putih atau abu-abu)
                  untuk fokus pada produk.
                </li>
                <li>
                  Hindari filter berlebihan yang mengubah warna atau tampilan
                  asli produk.
                </li>
                <li>
                  Unggah minimal 1 foto berkualitas tinggi, maksimal 3 untuk
                  efisiensi.
                </li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-lg flex items-start space-x-2">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Contoh: Untuk pakaian, foto produk saat dipakai atau digantung
                  dengan jelas menunjukkan tekstur dan warna.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Harga yang Menarik */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
              Menentukan Harga yang Menarik
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Harga yang tepat dapat membuat produk Anda menonjol di pasar.
                Berikut cara menetapkannya:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  Bandingkan harga produk serupa di platform untuk memastikan
                  daya saing.
                </li>
                <li>
                  Jika produk bekas, tetapkan harga 20-50% lebih rendah dari
                  harga asli, tergantung kondisi.
                </li>
                <li>
                  Tawarkan diskon kecil (misalnya, 5-10%) untuk menarik
                  perhatian pembeli.
                </li>
                <li>
                  Sertakan biaya pengiriman dalam perhitungan atau tawarkan opsi
                  pengiriman gratis untuk pembelian tertentu.
                </li>
                <li>
                  Gunakan harga bulat (misalnya, Rp 50.000 daripada Rp 49.999)
                  untuk kesan sederhana dan profesional.
                </li>
              </ul>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Harga Kompetitif</Badge>
                <Badge variant="secondary">Diskon</Badge>
                <Badge variant="secondary">Transparansi</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
