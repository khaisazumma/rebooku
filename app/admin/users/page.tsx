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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface User {
  _id: string;
  username: string;
  fullName: string;
  email: string;
  joinDate: string;
  isActive: boolean;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user || !user.id || user.role !== "admin") {
      router.push("/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        // Simulate API call to /api/admin/users
        const mockData = {
          users: [
            {
              _id: "1",
              username: "user1",
              fullName: "User One",
              email: "user1@example.com",
              joinDate: "2025-06-20",
              isActive: true,
            },
          ],
          totalPages: 1,
        };
        setUsers(mockData.users);
        setTotalPages(mockData.totalPages);
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat daftar pengguna.",
          variant: "destructive",
        });
      }
    };

    fetchUsers();
  }, [user, router, toast, search, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/users?search=${encodeURIComponent(search)}&page=1`);
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // Simulate API call to /api/admin/users/:id/toggle-status
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, isActive: !currentStatus } : u
        )
      );
      toast({
        title: "Status diperbarui",
        description: `Pengguna telah ${
          !currentStatus ? "diaktifkan" : "dinonaktifkan"
        }.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui status pengguna.",
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
              Kelola Pengguna
            </h1>
            <p className="text-sm text-gray-600">
              Lihat dan kelola akun pengguna
            </p>
          </div>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
            <CardDescription>
              Cari pengguna berdasarkan nama, username, atau email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Cari pengguna..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
                <Button type="submit">Cari</Button>
              </div>
            </form>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tanggal Bergabung</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="https://via.placeholder.com/100"
                            alt={u.fullName}
                          />
                          <AvatarFallback>
                            {u.fullName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {u.fullName} ({u.username})
                      </div>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {new Date(u.joinDate).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>{u.isActive ? "Aktif" : "Nonaktif"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={u.isActive}
                        onCheckedChange={() =>
                          handleToggleStatus(u._id, u.isActive)
                        }
                      />
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
                      `/admin/users?search=${encodeURIComponent(search)}&page=${
                        currentPage - 1
                      }`
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
                      `/admin/users?search=${encodeURIComponent(search)}&page=${
                        currentPage + 1
                      }`
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
