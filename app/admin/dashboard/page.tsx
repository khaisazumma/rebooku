"use client";

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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  totalUsers: number;
  totalBooks: number;
  totalArticles: number;
  totalTransactions: number;
  totalRevenue: number;
}

interface RecentUser {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  joinDate: string;
}

interface RecentBook {
  _id: string;
  title: string;
  author: string;
  seller: { username: string; fullName: string };
  createdAt: string;
}

interface RecentTransaction {
  _id: string;
  buyer: { username: string; fullName: string };
  finalAmount: number;
  status: string;
  createdAt: string;
}

interface MonthlyStat {
  _id: { year: number; month: number };
  count: number;
  revenue: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalBooks: 0,
    totalArticles: 0,
    totalTransactions: 0,
    totalRevenue: 0,
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<
    RecentTransaction[]
  >([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);

  useEffect(() => {
    if (!user || !user.id || user.role !== "admin") {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const mockData = {
          stats: {
            totalUsers: 150,
            totalBooks: 300,
            totalArticles: 50,
            totalTransactions: 200,
            totalRevenue: 50000,
          },
          recentUsers: [
            {
              _id: "1",
              username: "user1",
              fullName: "User One",
              email: "user1@example.com",
              joinDate: "2025-06-20",
            },
          ],
          recentBooks: [
            {
              _id: "1",
              title: "Book Title",
              author: "Author Name",
              seller: { username: "seller1", fullName: "Seller One" },
              createdAt: "2025-06-20",
            },
          ],
          recentTransactions: [
            {
              _id: "1",
              buyer: { username: "buyer1", fullName: "Buyer One" },
              finalAmount: 100000,
              status: "completed",
              createdAt: "2025-06-20",
            },
          ],
          monthlyStats: [
            { _id: { year: 2025, month: 1 }, count: 10, revenue: 200000 },
            { _id: { year: 2025, month: 2 }, count: 15, revenue: 300000 },
          ],
        };

        setStats(mockData.stats);
        setRecentUsers(mockData.recentUsers);
        setRecentBooks(mockData.recentBooks);
        setRecentTransactions(mockData.recentTransactions);
        setMonthlyStats(mockData.monthlyStats);
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat data dashboard.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [user, router, toast]);

  if (!user || user.role !== "admin") return null;

  const chartData = monthlyStats.map((stat) => ({
    name: `${stat._id.month}/${stat._id.year}`,
    transactions: stat.count,
    revenue: stat.revenue / 1000,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/users"
              className="px-4 py-2 rounded bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition"
            >
              Kelola Pengguna
            </Link>
            <Link
              href="/admin/promo-codes"
              className="px-4 py-2 rounded bg-green-100 text-green-700 font-medium hover:bg-green-200 transition"
            >
              Kode Promo
            </Link>
            <Link
              href="/admin/articles"
              className="px-4 py-2 rounded bg-red-100 text-red-700 font-medium hover:bg-red-200 transition"
            >
              Kelola Artikel
            </Link>
            <Link
              href="/admin/transactions"
              className="px-4 py-2 rounded bg-purple-100 text-purple-700 font-medium hover:bg-purple-200 transition"
            >
              Transaksi
            </Link>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard Admin
            </h1>
            <p className="text-sm text-gray-600">
              Ringkasan aktivitas Rebooku Marketplace
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Buku</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalBooks}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Artikel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalArticles}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalTransactions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                Rp {stats.totalRevenue.toLocaleString("id-ID")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Stats Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Statistik Bulanan</CardTitle>
            <CardDescription>
              Transaksi dan pendapatan per bulan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar
                    yAxisId="left"
                    dataKey="transactions"
                    fill="#3b82f6"
                    name="Transaksi"
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    fill="#10b981"
                    name="Pendapatan (ribuan)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Pengguna Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Tanggal Bergabung</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((u) => (
                    <TableRow key={u._id}>
                      <TableCell>{u.fullName}</TableCell>
                      <TableCell>
                        {new Date(u.joinDate).toLocaleDateString("id-ID")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Buku Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Penjual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBooks.map((b) => (
                    <TableRow key={b._id}>
                      <TableCell>{b.title}</TableCell>
                      <TableCell>{b.seller.fullName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Transaksi Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pembeli</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((t) => (
                    <TableRow key={t._id}>
                      <TableCell>{t.buyer.fullName}</TableCell>
                      <TableCell>
                        Rp {t.finalAmount.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell>{t.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
