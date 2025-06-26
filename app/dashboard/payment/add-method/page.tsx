"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditCard, DollarSign, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethod {
  id: string;
  type: "credit_card" | "bank_transfer";
  details: string;
  lastUsed: string;
}

export default function AddPaymentMethodPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [formData, setFormData] = useState({
    type: "credit_card" as "credit_card" | "bank_transfer",
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | { name: string; value: string }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (formData.type === "credit_card") {
      if (
        !formData.cardNumber ||
        formData.cardNumber.replace(/\s/g, "").length !== 16
      ) {
        toast({
          title: "Error",
          description: "Nomor kartu harus 16 digit.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      if (!formData.cardHolder || formData.cardHolder.length < 2) {
        toast({
          title: "Error",
          description: "Nama pemilik kartu harus diisi.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        toast({
          title: "Error",
          description: "Tanggal kadaluarsa harus dalam format MM/YY.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    } else {
      if (!formData.bankName || formData.bankName.length < 2) {
        toast({
          title: "Error",
          description: "Nama bank harus diisi.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      if (
        !formData.accountNumber ||
        formData.accountNumber.replace(/\s/g, "").length < 8
      ) {
        toast({
          title: "Error",
          description: "Nomor rekening harus minimal 8 digit.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      if (!formData.accountHolder || formData.accountHolder.length < 2) {
        toast({
          title: "Error",
          description: "Nama pemilik rekening harus diisi.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
    }

    // Save to localStorage
    const newMethod: PaymentMethod = {
      id: `pm${Date.now()}`,
      type: formData.type,
      details:
        formData.type === "credit_card"
          ? `**** ${formData.cardNumber.slice(-4)}`
          : `${formData.bankName} **** ${formData.accountNumber.slice(-4)}`,
      lastUsed: new Date().toISOString().split("T")[0],
    };

    const existingMethods = JSON.parse(
      localStorage.getItem(`rebooku_payment_methods_${user?.id}`) || "[]"
    ) as PaymentMethod[];
    const updatedMethods = [...existingMethods, newMethod];
    localStorage.setItem(
      `rebooku_payment_methods_${user?.id}`,
      JSON.stringify(updatedMethods)
    );

    toast({
      title: "Metode pembayaran ditambahkan",
      description: "Metode pembayaran baru telah disimpan.",
    });

    setIsSubmitting(false);
    router.push("/dashboard/payment");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tambah Metode Pembayaran
              </h1>
              <p className="text-sm text-gray-600">
                Tambahkan metode pembayaran baru untuk transaksi di Rebooku
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/payment">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Link>
          </Button>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Formulir Metode Pembayaran</CardTitle>
            <CardDescription>
              Masukkan detail metode pembayaran Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipe Metode Pembayaran</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      handleInputChange({ name: "type", value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Pilih tipe metode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit_card">
                        <div className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          Kartu Kredit
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center">
                          <DollarSign className="mr-2 h-4 w-4" />
                          Transfer Bank
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type === "credit_card" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Nomor Kartu</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardHolder">Nama Pemilik Kartu</Label>
                      <Input
                        id="cardHolder"
                        name="cardHolder"
                        value={formData.cardHolder}
                        onChange={handleInputChange}
                        placeholder="Nama di kartu"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Tanggal Kadaluarsa</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Nama Bank</Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        placeholder="Contoh: BCA, Mandiri"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Nomor Rekening</Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleInputChange}
                        placeholder="Nomor rekening bank"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountHolder">
                        Nama Pemilik Rekening
                      </Label>
                      <Input
                        id="accountHolder"
                        name="accountHolder"
                        value={formData.accountHolder}
                        onChange={handleInputChange}
                        placeholder="Nama pemilik rekening"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dashboard/payment")}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : "Simpan Metode"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
