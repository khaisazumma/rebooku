"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  CreditCard,
  Truck,
  Shield,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: "bank" | "ewallet" | "cod";
  name: string;
  description: string;
  fee: number;
  icon: string;
}

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
    province: "",
    postalCode: "",
    isDefault: false,
  });
  const [selectedShipping, setSelectedShipping] = useState("regular");
  const [selectedPayment, setSelectedPayment] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if cart is empty or user not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (items.length === 0) {
      router.push("/cart");
      return;
    }
  }, [user, items, router]);

  const shippingOptions = [
    {
      id: "regular",
      name: "Pengiriman Regular",
      description: "3-5 hari kerja",
      price: 15000,
      icon: "🚚",
    },
    {
      id: "express",
      name: "Pengiriman Express",
      description: "1-2 hari kerja",
      price: 25000,
      icon: "⚡",
    },
    {
      id: "same-day",
      name: "Same Day Delivery",
      description: "Hari yang sama (Jakarta only)",
      price: 35000,
      icon: "🏃",
    },
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: "bca",
      type: "bank",
      name: "Bank BCA",
      description: "Transfer ke rekening BCA",
      fee: 0,
      icon: "🏦",
    },
    {
      id: "mandiri",
      type: "bank",
      name: "Bank Mandiri",
      description: "Transfer ke rekening Mandiri",
      fee: 0,
      icon: "🏦",
    },
    {
      id: "gopay",
      type: "ewallet",
      name: "GoPay",
      description: "Bayar dengan GoPay",
      fee: 2500,
      icon: "💳",
    },
    {
      id: "ovo",
      type: "ewallet",
      name: "OVO",
      description: "Bayar dengan OVO",
      fee: 2500,
      icon: "💳",
    },
    {
      id: "dana",
      type: "ewallet",
      name: "DANA",
      description: "Bayar dengan DANA",
      fee: 2500,
      icon: "💳",
    },
    {
      id: "cod",
      type: "cod",
      name: "Bayar di Tempat (COD)",
      description: "Bayar saat barang diterima",
      fee: 5000,
      icon: "💰",
    },
  ];

  const selectedShippingOption = shippingOptions.find(
    (option) => option.id === selectedShipping
  );
  const selectedPaymentMethod = paymentMethods.find(
    (method) => method.id === selectedPayment
  );

  const shippingCost = selectedShippingOption?.price || 0;
  const paymentFee = selectedPaymentMethod?.fee || 0;
  const finalTotal = total + shippingCost + paymentFee;

  const handleAddressChange = (
    field: keyof ShippingAddress,
    value: string | boolean
  ) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    const required = [
      "fullName",
      "phone",
      "address",
      "city",
      "province",
      "postalCode",
    ];
    return required.every(
      (field) => shippingAddress[field as keyof ShippingAddress]
    );
  };

  const validateStep2 = () => {
    return selectedShipping && selectedPayment;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi semua data alamat pengiriman",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2 && !validateStep2()) {
      toast({
        title: "Pilihan tidak lengkap",
        description: "Mohon pilih metode pengiriman dan pembayaran",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create order object
      const order = {
        id: `ORD-${Date.now()}`,
        date: new Date().toISOString(),
        items: items,
        total: finalTotal,
        status: selectedPayment === "cod" ? "pending" : "pending_payment",
        shipping: {
          address: shippingAddress,
          method: selectedShippingOption,
          cost: shippingCost,
        },
        payment: {
          method: selectedPaymentMethod,
          fee: paymentFee,
          status: "pending",
        },
        notes: orderNotes,
      };

      // Save order to localStorage (in real app, this would be API call)
      const existingOrders = JSON.parse(
        localStorage.getItem("rebooku_orders") || "[]"
      );
      existingOrders.unshift(order);
      localStorage.setItem("rebooku_orders", JSON.stringify(existingOrders));

      // Clear cart
      clearCart();

      // Show success message
      toast({
        title: "Pesanan berhasil dibuat!",
        description: `Pesanan ${order.id} telah dibuat. Silakan lakukan pembayaran.`,
      });

      // Redirect to order confirmation
      router.push(`/checkout/success?orderId=${order.id}`);
    } catch (error) {
      toast({
        title: "Gagal membuat pesanan",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Keranjang
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Selesaikan pesanan Anda</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-medium">{step}</span>
                  )}
                </div>
                <div className="ml-4 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step === 1 && "Alamat Pengiriman"}
                    {step === 2 && "Pengiriman & Pembayaran"}
                    {step === 3 && "Konfirmasi Pesanan"}
                  </p>
                </div>
                {step < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Alamat Pengiriman
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Nama Lengkap *</Label>
                        <Input
                          id="fullName"
                          value={shippingAddress.fullName}
                          onChange={(e) =>
                            handleAddressChange("fullName", e.target.value)
                          }
                          placeholder="Nama penerima"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Nomor Telepon *</Label>
                        <Input
                          id="phone"
                          value={shippingAddress.phone}
                          onChange={(e) =>
                            handleAddressChange("phone", e.target.value)
                          }
                          placeholder="08xxxxxxxxxx"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Alamat Lengkap *</Label>
                      <Textarea
                        id="address"
                        value={shippingAddress.address}
                        onChange={(e) =>
                          handleAddressChange("address", e.target.value)
                        }
                        placeholder="Jalan, nomor rumah, RT/RW, kelurahan"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Kota/Kabupaten *</Label>
                        <Select
                          value={shippingAddress.city}
                          onValueChange={(value) =>
                            handleAddressChange("city", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih kota" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="jakarta">Jakarta</SelectItem>
                            <SelectItem value="bandung">Bandung</SelectItem>
                            <SelectItem value="surabaya">Surabaya</SelectItem>
                            <SelectItem value="medan">Medan</SelectItem>
                            <SelectItem value="yogyakarta">
                              Yogyakarta
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="province">Provinsi *</Label>
                        <Select
                          value={shippingAddress.province}
                          onValueChange={(value) =>
                            handleAddressChange("province", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih provinsi" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dki-jakarta">
                              DKI Jakarta
                            </SelectItem>
                            <SelectItem value="jawa-barat">
                              Jawa Barat
                            </SelectItem>
                            <SelectItem value="jawa-timur">
                              Jawa Timur
                            </SelectItem>
                            <SelectItem value="sumatera-utara">
                              Sumatera Utara
                            </SelectItem>
                            <SelectItem value="di-yogyakarta">
                              DI Yogyakarta
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="postalCode">Kode Pos *</Label>
                        <Input
                          id="postalCode"
                          value={shippingAddress.postalCode}
                          onChange={(e) =>
                            handleAddressChange("postalCode", e.target.value)
                          }
                          placeholder="12345"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isDefault"
                        checked={shippingAddress.isDefault}
                        onCheckedChange={(checked) =>
                          handleAddressChange("isDefault", checked as boolean)
                        }
                      />
                      <Label htmlFor="isDefault" className="text-sm">
                        Jadikan sebagai alamat utama
                      </Label>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Shipping & Payment */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* Shipping Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Truck className="h-5 w-5 mr-2" />
                      Metode Pengiriman
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={selectedShipping}
                      onValueChange={setSelectedShipping}
                    >
                      <div className="space-y-3">
                        {shippingOptions.map((option) => (
                          <div
                            key={option.id}
                            className="flex items-center space-x-3 p-3 border rounded-lg"
                          >
                            <RadioGroupItem value={option.id} id={option.id} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{option.icon}</span>
                                  <div>
                                    <Label
                                      htmlFor={option.id}
                                      className="font-medium cursor-pointer"
                                    >
                                      {option.name}
                                    </Label>
                                    <p className="text-sm text-gray-500">
                                      {option.description}
                                    </p>
                                  </div>
                                </div>
                                <span className="font-medium">
                                  Rp {option.price.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Metode Pembayaran
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={selectedPayment}
                      onValueChange={setSelectedPayment}
                    >
                      <div className="space-y-3">
                        {paymentMethods.map((method) => (
                          <div
                            key={method.id}
                            className="flex items-center space-x-3 p-3 border rounded-lg"
                          >
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">{method.icon}</span>
                                  <div>
                                    <Label
                                      htmlFor={method.id}
                                      className="font-medium cursor-pointer"
                                    >
                                      {method.name}
                                    </Label>
                                    <p className="text-sm text-gray-500">
                                      {method.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {method.fee > 0 ? (
                                    <span className="text-sm">
                                      +Rp {method.fee.toLocaleString()}
                                    </span>
                                  ) : (
                                    <Badge variant="secondary">Gratis</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Order Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Catatan Pesanan (Opsional)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Tambahkan catatan untuk penjual..."
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 3: Order Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Konfirmasi Pesanan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-medium mb-2">Alamat Pengiriman</h4>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium">
                            {shippingAddress.fullName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {shippingAddress.phone}
                          </p>
                          <p className="text-sm text-gray-600">
                            {shippingAddress.address}, {shippingAddress.city},{" "}
                            {shippingAddress.province}{" "}
                            {shippingAddress.postalCode}
                          </p>
                        </div>
                      </div>

                      {/* Shipping & Payment */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">
                            Metode Pengiriman
                          </h4>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium">
                              {selectedShippingOption?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedShippingOption?.description}
                            </p>
                            <p className="text-sm">
                              Rp{" "}
                              {selectedShippingOption?.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">
                            Metode Pembayaran
                          </h4>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium">
                              {selectedPaymentMethod?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedPaymentMethod?.description}
                            </p>
                            {selectedPaymentMethod?.fee &&
                              selectedPaymentMethod.fee > 0 && (
                                <p className="text-sm">
                                  Biaya: Rp{" "}
                                  {selectedPaymentMethod.fee.toLocaleString()}
                                </p>
                              )}
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium mb-2">Item Pesanan</h4>
                        <div className="space-y-3">
                          {items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-3 p-3 border rounded-lg"
                            >
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.title}
                                className="w-12 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <h5 className="font-medium">{item.title}</h5>
                                <p className="text-sm text-gray-500">
                                  {item.quantity} x Rp{" "}
                                  {item.price.toLocaleString()}
                                </p>
                              </div>
                              <span className="font-medium">
                                Rp{" "}
                                {(item.quantity * item.price).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {orderNotes && (
                        <div>
                          <h4 className="font-medium mb-2">Catatan Pesanan</h4>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm">{orderNotes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Terms & Conditions */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" required />
                      <Label
                        htmlFor="terms"
                        className="text-sm leading-relaxed"
                      >
                        Saya telah membaca dan menyetujui{" "}
                        <Link
                          href="/terms"
                          className="text-blue-600 hover:underline"
                        >
                          Syarat & Ketentuan
                        </Link>{" "}
                        serta{" "}
                        <Link
                          href="/privacy"
                          className="text-blue-600 hover:underline"
                        >
                          Kebijakan Privasi
                        </Link>{" "}
                        Rebooku. Saya memahami bahwa pesanan ini tidak dapat
                        dibatalkan setelah pembayaran dikonfirmasi.
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Sebelumnya
              </Button>

              {currentStep < 3 ? (
                <Button onClick={handleNextStep}>
                  Selanjutnya
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Buat Pesanan
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-3"
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.quantity} x Rp {item.price.toLocaleString()}
                          </p>
                        </div>
                        <span className="text-sm font-medium">
                          Rp {(item.quantity * item.price).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Costs Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>
                        Subtotal (
                        {items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                        item)
                      </span>
                      <span>Rp {total.toLocaleString()}</span>
                    </div>

                    {currentStep >= 2 && selectedShippingOption && (
                      <div className="flex justify-between text-sm">
                        <span>Pengiriman ({selectedShippingOption.name})</span>
                        <span>Rp {shippingCost.toLocaleString()}</span>
                      </div>
                    )}

                    {currentStep >= 2 &&
                      selectedPaymentMethod &&
                      selectedPaymentMethod.fee > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Biaya Pembayaran</span>
                          <span>Rp {paymentFee.toLocaleString()}</span>
                        </div>
                      )}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>Rp {finalTotal.toLocaleString()}</span>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          Transaksi Aman
                        </p>
                        <p className="text-xs text-green-700">
                          Data Anda dilindungi dengan enkripsi SSL
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
