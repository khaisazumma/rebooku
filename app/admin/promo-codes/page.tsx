"use client";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface PromoCode {
  _id: string;
  code: string;
  description: string;
  discountType: string;
  discountValue: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdBy: { username: string };
}

export default function AdminPromoCodesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minPurchase: "",
    maxDiscount: "",
    usageLimit: "",
    validFrom: "",
    validUntil: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user || !user.id || user.role !== "admin") {
      router.push("/login");
      return;
    }

    const fetchPromoCodes = async () => {
      try {
        // Simulate API call to /api/admin/promo-codes
        const mockData = [
          {
            _id: "1",
            code: "DISC10",
            description: "Diskon 10%",
            discountType: "percentage",
            discountValue: 10,
            minPurchase: 50000,
            maxDiscount: 20000,
            usageLimit: 5,
            validFrom: "2025-06-01",
            validUntil: "2025-12-31",
            isActive: true,
            createdBy: { username: "admin1" },
          },
        ];
        setPromoCodes(mockData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat daftar kode promo.",
          variant: "destructive",
        });
      }
    };

    fetchPromoCodes();
  }, [user, router, toast]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { name: string; value: string }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.code || formData.code.length < 3) {
      toast({
        title: "Error",
        description: "Kode promo harus diisi dan minimal 3 karakter.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    if (!formData.discountValue || Number(formData.discountValue) <= 0) {
      toast({
        title: "Error",
        description: "Nilai diskon harus lebih dari 0.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call to /api/admin/promo-codes
      const newPromoCode: PromoCode = {
        _id: `promo${Date.now()}`,
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minPurchase: Number(formData.minPurchase) || 0,
        maxDiscount: formData.maxDiscount
          ? Number(formData.maxDiscount)
          : undefined,
        usageLimit: Number(formData.usageLimit) || 1,
        validFrom: formData.validFrom,
        validUntil: formData.validUntil,
        isActive: true,
        createdBy: { username: user?.id || "" },
      };
      setPromoCodes([...promoCodes, newPromoCode]);
      toast({
        title: "Kode promo dibuat",
        description: "Kode promo telah berhasil disimpan.",
      });
      setFormData({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        minPurchase: "",
        maxDiscount: "",
        usageLimit: "",
        validFrom: "",
        validUntil: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat kode promo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (
    promoCodeId: string,
    currentStatus: boolean
  ) => {
    try {
      // Simulate API call to /api/admin/promo-codes/:id/toggle
      setPromoCodes(
        promoCodes.map((p) =>
          p._id === promoCodeId ? { ...p, isActive: !currentStatus } : p
        )
      );
      toast({
        title: "Status diperbarui",
        description: `Kode promo telah ${
          !currentStatus ? "diaktifkan" : "dinonaktifkan"
        }.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui status kode promo.",
        variant: "destructive",
      });
    }
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Kelola Kode Promo
            </h1>
            <p className="text-sm text-gray-600">Buat dan kelola kode promo</p>
          </div>
        </div>

        {/* Create Promo Code Form */}
        <Card>
          <CardHeader>
            <CardTitle>Buat Kode Promo Baru</CardTitle>
            <CardDescription>
              Isi detail kode promo untuk promosi baru
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Kode Promo</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Masukkan kode promo"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountType">Tipe Diskon</Label>
                  <Select
                    name="discountType"
                    value={formData.discountType}
                    onValueChange={(value) =>
                      handleInputChange({ name: "discountType", value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Persentase</SelectItem>
                      <SelectItem value="fixed">Nominal Tetap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">Nilai Diskon</Label>
                  <Input
                    id="discountValue"
                    name="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    placeholder="Masukkan nilai diskon"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minPurchase">Minimal Pembelian</Label>
                  <Input
                    id="minPurchase"
                    name="minPurchase"
                    type="number"
                    value={formData.minPurchase}
                    onChange={handleInputChange}
                    placeholder="Masukkan minimal pembelian"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount">
                    Maksimal Diskon (opsional)
                  </Label>
                  <Input
                    id="maxDiscount"
                    name="maxDiscount"
                    type="number"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                    placeholder="Masukkan maksimal diskon"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usageLimit">Batas Penggunaan</Label>
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    placeholder="Masukkan batas penggunaan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Berlaku Mulai</Label>
                  <Input
                    id="validFrom"
                    name="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Berlaku Hingga</Label>
                  <Input
                    id="validUntil"
                    name="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Masukkan deskripsi kode promo"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Buat Kode Promo"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Promo Codes List */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Kode Promo</CardTitle>
            <CardDescription>Kelola kode promo yang sudah ada</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead>Diskon</TableHead>
                  <TableHead>Berlaku</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promoCodes.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>{p.code}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>
                      {p.discountType === "percentage"
                        ? `${p.discountValue}%`
                        : `Rp ${p.discountValue.toLocaleString("id-ID")}`}
                    </TableCell>
                    <TableCell>
                      {new Date(p.validFrom).toLocaleDateString("id-ID")} -{" "}
                      {new Date(p.validUntil).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>{p.isActive ? "Aktif" : "Nonaktif"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={p.isActive}
                        onCheckedChange={() =>
                          handleToggleStatus(p._id, p.isActive)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
