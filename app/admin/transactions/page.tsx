"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  _id: string;
  buyer: { username: string; fullName: string };
  items: { book: { title: string } }[];
  finalAmount: number;
  status: string;
  createdAt: string;
}

export default function AdminTransactionsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const statusOptions = ["pending", "completed", "cancelled"];

  useEffect(() => {
    if (!user || !user.id || user.role !== "admin") {
      router.push("/login");
      return;
    }

    const fetchTransactions = async () => {
      try {
        // Simulate API call to /api/admin/transactions
        const mockData = {
          transactions: [
            {
              _id: "1",
              buyer: { username: "buyer1", fullName: "Buyer One" },
              items: [{ book: { title: "Book Title" } }],
              finalAmount: 100000,
              status: "completed",
              createdAt: "2025-06-20",
            },
          ],
          totalPages: 1,
        };
        setTransactions(mockData.transactions);
        setTotalPages(mockData.totalPages);
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat daftar transaksi.",
          variant: "destructive",
        });
      }
    };

    fetchTransactions();
  }, [user, router, toast, status, currentPage]);

  const handleStatusFilter = (value: string) => {
    setStatus(value);
    router.push(
      `/admin/transactions?status=${encodeURIComponent(value)}&page=1`
    );
  };

  const handleUpdateStatus = async (
    transactionId: string,
    newStatus: string
  ) => {
    try {
      // Simulate API call to /api/admin/transactions/:id/status
      setTransactions(
        transactions.map((t) =>
          t._id === transactionId ? { ...t, status: newStatus } : t
        )
      );
      toast({
        title: "Status diperbarui",
        description: "Status transaksi telah diperbarui.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui status transaksi.",
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
              Kelola Transaksi
            </h1>
            <p className="text-sm text-gray-600">Lihat dan kelola transaksi</p>
          </div>
        </div>

        {/* Filter and Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Transaksi</CardTitle>
            <CardDescription>
              Filter transaksi berdasarkan status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-4">
              <Select onValueChange={handleStatusFilter} value={status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pembeli</TableHead>
                  <TableHead>Buku</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>{t.buyer.fullName}</TableCell>
                    <TableCell>
                      {t.items.map((i) => i.book.title).join(", ")}
                    </TableCell>
                    <TableCell>
                      Rp {t.finalAmount.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>{t.status}</TableCell>
                    <TableCell>
                      {new Date(t.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <Select
                        onValueChange={(value) =>
                          handleUpdateStatus(t._id, value)
                        }
                        value={t.status}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-gray-600">
                Halaman {currentPage} dari {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() =>
                    router.push(
                      `/admin/transactions?status=${encodeURIComponent(
                        status
                      )}&page=${currentPage - 1}`
                    )
                  }
                >
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    router.push(
                      `/admin/transactions?status=${encodeURIComponent(
                        status
                      )}&page=${currentPage + 1}`
                    )
                  }
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
