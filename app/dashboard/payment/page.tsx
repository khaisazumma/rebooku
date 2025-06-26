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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Trash2,
  Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  bookTitle: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  paymentMethod: string;
}

interface PaymentMethod {
  id: string;
  type: "credit_card" | "bank_transfer";
  details: string;
  lastUsed: string;
}

export default function PaymentDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Load data from localStorage or mock data
  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Load transactions
    const savedTransactions = localStorage.getItem(
      `rebooku_transactions_${user?.id}`
    );
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions);
      setTransactions(parsedTransactions);
    } else {
      const mockTransactions: Transaction[] = [
        {
          id: "tx1",
          bookTitle: "Atomic Habits",
          amount: 75000,
          status: "completed",
          date: "2024-06-20",
          paymentMethod: "Credit Card (**** 1234)",
        },
        {
          id: "tx2",
          bookTitle: "The Psychology of Money",
          amount: 65000,
          status: "pending",
          date: "2024-06-18",
          paymentMethod: "Bank Transfer (BCA)",
        },
        {
          id: "tx3",
          bookTitle: "Clean Code",
          amount: 95000,
          status: "completed",
          date: "2024-06-15",
          paymentMethod: "Credit Card (**** 5678)",
        },
        {
          id: "tx4",
          bookTitle: "Sapiens",
          amount: 80000,
          status: "failed",
          date: "2024-06-10",
          paymentMethod: "Bank Transfer (Mandiri)",
        },
      ];
      setTransactions(mockTransactions);
      localStorage.setItem(
        `rebooku_transactions_${user?.id}`,
        JSON.stringify(mockTransactions)
      );
    }

    // Load payment methods
    const savedPaymentMethods = localStorage.getItem(
      `rebooku_payment_methods_${user?.id}`
    );
    if (savedPaymentMethods) {
      const parsedPaymentMethods = JSON.parse(savedPaymentMethods);
      setPaymentMethods(parsedPaymentMethods);
    } else {
      const mockPaymentMethods: PaymentMethod[] = [
        {
          id: "pm1",
          type: "credit_card",
          details: "Visa **** 1234",
          lastUsed: "2024-06-20",
        },
        {
          id: "pm2",
          type: "bank_transfer",
          details: "BCA Account **** 5678",
          lastUsed: "2024-06-18",
        },
      ];
      setPaymentMethods(mockPaymentMethods);
      localStorage.setItem(
        `rebooku_payment_methods_${user?.id}`,
        JSON.stringify(mockPaymentMethods)
      );
    }
  }, [user, router]);

  const handleDeletePaymentMethod = (methodId: string) => {
    const updatedMethods = paymentMethods.filter(
      (method) => method.id !== methodId
    );
    setPaymentMethods(updatedMethods);
    localStorage.setItem(
      `rebooku_payment_methods_${user?.id}`,
      JSON.stringify(updatedMethods)
    );
    toast({
      title: "Metode pembayaran dihapus",
      description: "Metode pembayaran telah dihapus dari daftar Anda",
    });
  };

  const completedTransactions = transactions.filter(
    (tx) => tx.status === "completed"
  ).length;
  const pendingTransactions = transactions.filter(
    (tx) => tx.status === "pending"
  ).length;
  const totalAmount = transactions
    .filter((tx) => tx.status === "completed")
    .reduce((sum, tx) => sum + tx.amount, 0);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header and User Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Pembayaran
              </h1>
              <p className="text-sm text-gray-600">
                Kelola transaksi dan metode pembayaran Anda di Rebooku
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/dashboard/payment/add-method">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Metode Pembayaran
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: DollarSign,
              label: "Total Pembayaran",
              value: `Rp ${totalAmount.toLocaleString()}`,
              color: "text-green-500",
            },
            {
              icon: Clock,
              label: "Transaksi Tertunda",
              value: pendingTransactions,
              color: "text-yellow-500",
            },
            {
              icon: CheckCircle,
              label: "Transaksi Selesai",
              value: completedTransactions,
              color: "text-blue-500",
            },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 flex items-center space-x-3">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs for Transactions and Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Pembayaran Anda</CardTitle>
            <CardDescription>
              Pantau riwayat transaksi dan kelola metode pembayaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transactions">
              <TabsList className="mb-4">
                <TabsTrigger value="transactions">
                  Riwayat Transaksi
                </TabsTrigger>
                <TabsTrigger value="payment-methods">
                  Metode Pembayaran
                </TabsTrigger>
              </TabsList>
              <TabsContent value="transactions">
                <TransactionList transactions={transactions} />
              </TabsContent>
              <TabsContent value="payment-methods">
                <PaymentMethodList
                  paymentMethods={paymentMethods}
                  handleDeletePaymentMethod={handleDeletePaymentMethod}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <h3 className="text-lg font-medium">Belum ada transaksi</h3>
        <p className="text-gray-500 mb-4">
          Mulai beli atau jual buku di Rebooku untuk melihat transaksi
        </p>
        <Button asChild>
          <Link href="/books">
            <Plus className="mr-2 h-4 w-4" />
            Jelajahi Buku
          </Link>
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "Selesai";
      case "pending":
        return "Tertunda";
      case "failed":
        return "Gagal";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <Card key={tx.id} className="overflow-hidden">
          <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {tx.bookTitle}
                  </h3>
                  <p className="text-gray-600">ID Transaksi: {tx.id}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getStatusColor(tx.status)}>
                      <span className="ml-1">{getStatusText(tx.status)}</span>
                    </Badge>
                    <Badge variant="outline">{tx.paymentMethod}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">
                    Rp {tx.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(tx.date).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[];
  handleDeletePaymentMethod: (methodId: string) => void;
}

const PaymentMethodList: React.FC<PaymentMethodListProps> = ({
  paymentMethods,
  handleDeletePaymentMethod,
}) => {
  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-12">
        <CreditCard className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <h3 className="text-lg font-medium">Belum ada metode pembayaran</h3>
        <p className="text-gray-500 mb-4">
          Tambahkan metode pembayaran untuk mempermudah transaksi
        </p>
        <Button asChild>
          <Link href="/dashboard/payment/add-method">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Metode Pembayaran
          </Link>
        </Button>
      </div>
    );
  }

  const getMethodIcon = (type: PaymentMethod["type"]) => {
    switch (type) {
      case "credit_card":
        return <CreditCard className="h-4 w-4" />;
      case "bank_transfer":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <Card key={method.id} className="overflow-hidden">
          <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex items-center space-x-3">
              {getMethodIcon(method.type)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {method.details}
                </h3>
                <p className="text-sm text-gray-600">
                  Terakhir digunakan:{" "}
                  {new Date(method.lastUsed).toLocaleDateString("id-ID")}
                </p>
              </div>
            </div>
            <div className="ml-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeletePaymentMethod(method.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Hapus
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
