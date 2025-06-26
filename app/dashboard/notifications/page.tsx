"use client";

import type React from "react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCircle,
  Package,
  AlertCircle,
  Trash2,
  Eye,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  message: string;
  type: "transaction" | "book" | "system";
  status: "read" | "unread";
  date: string;
}

export default function NotificationsDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  // Load notifications from localStorage or mock data
  useEffect(() => {
    if (!user || !user.id) {
      router.push("/login");
      return;
    }

    const savedNotifications = localStorage.getItem(
      `rebooku_notifications_${user.id}`
    );
    if (savedNotifications) {
      const parsedNotifications = JSON.parse(
        savedNotifications
      ) as Notification[];
      setNotifications(parsedNotifications);
      setFilteredNotifications(parsedNotifications);
    } else {
      const mockNotifications: Notification[] = [
        {
          id: "notif1",
          message: "Transaksi untuk 'Atomic Habits' telah selesai.",
          type: "transaction",
          status: "unread",
          date: "2025-06-24",
        },
        {
          id: "notif2",
          message: "Buku 'The Psychology of Money' Anda telah dilihat 50 kali.",
          type: "book",
          status: "unread",
          date: "2025-06-23",
        },
        {
          id: "notif3",
          message: "Pembaruan sistem: Fitur baru tersedia di Rebooku!",
          type: "system",
          status: "read",
          date: "2025-06-22",
        },
        {
          id: "notif4",
          message: "Transaksi untuk 'Clean Code' sedang tertunda.",
          type: "transaction",
          status: "unread",
          date: "2025-06-21",
        },
      ];
      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
      localStorage.setItem(
        `rebooku_notifications_${user.id}`,
        JSON.stringify(mockNotifications)
      );
    }
  }, [user, router]);

  const handleMarkAsRead = (notificationId: string) => {
    if (!notifications || !user?.id) return;
    const updatedNotifications = notifications.map((notif) =>
      notif.id === notificationId ? { ...notif, status: "read" } : notif
    );
    setNotifications(updatedNotifications);
    setFilteredNotifications(
      activeTab === "all"
        ? updatedNotifications
        : updatedNotifications.filter((notif) => notif.status === "unread")
    );
    localStorage.setItem(
      `rebooku_notifications_${user.id}`,
      JSON.stringify(updatedNotifications)
    );
    toast({
      title: "Notifikasi ditandai sebagai dibaca",
      description: "Notifikasi telah diperbarui.",
    });
  };

  const handleDeleteNotification = (notificationId: string) => {
    if (!notifications || !user?.id) return;
    const updatedNotifications = notifications.filter(
      (notif) => notif.id !== notificationId
    );
    setNotifications(updatedNotifications);
    setFilteredNotifications(
      activeTab === "all"
        ? updatedNotifications
        : updatedNotifications.filter((notif) => notif.status === "unread")
    );
    localStorage.setItem(
      `rebooku_notifications_${user.id}`,
      JSON.stringify(updatedNotifications)
    );
    toast({
      title: "Notifikasi dihapus",
      description: "Notifikasi telah dihapus dari daftar Anda.",
    });
  };

  const handleMarkAllAsRead = () => {
    if (!notifications || !user?.id) return;
    const updatedNotifications = notifications.map((notif) => ({
      ...notif,
      status: "read",
    }));
    setNotifications(updatedNotifications);
    setFilteredNotifications(activeTab === "all" ? updatedNotifications : []);
    localStorage.setItem(
      `rebooku_notifications_${user.id}`,
      JSON.stringify(updatedNotifications)
    );
    toast({
      title: "Semua notifikasi ditandai dibaca",
      description: "Semua notifikasi telah diperbarui.",
    });
  };

  const unreadNotifications = notifications.filter(
    (notif) => notif.status === "unread"
  ).length;
  const totalNotifications = notifications.length;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header and User Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifikasi</h1>
              <p className="text-sm text-gray-600">
                Pantau pembaruan terkait transaksi dan buku Anda di Rebooku
              </p>
            </div>
          </div>
          <Button
            onClick={handleMarkAllAsRead}
            disabled={unreadNotifications === 0}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Tandai Semua Dibaca
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Bell,
              label: "Total Notifikasi",
              value: totalNotifications,
              color: "text-blue-500",
            },
            {
              icon: AlertCircle,
              label: "Belum Dibaca",
              value: unreadNotifications,
              color: "text-yellow-500",
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

        {/* Notifications List with Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>
              Daftar Notifikasi ({filteredNotifications.length})
            </CardTitle>
            <CardDescription>
              Kelola notifikasi Anda untuk tetap update
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="all"
              onValueChange={(value) => {
                setActiveTab(value as "all" | "unread");
                if (value === "all") {
                  setFilteredNotifications(notifications);
                } else {
                  setFilteredNotifications(
                    notifications.filter((notif) => notif.status === "unread")
                  );
                }
              }}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="all">Semua</TabsTrigger>
                <TabsTrigger value="unread">Belum Dibaca</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <NotificationList
                  notifications={filteredNotifications}
                  handleMarkAsRead={handleMarkAsRead}
                  handleDeleteNotification={handleDeleteNotification}
                />
              </TabsContent>
              <TabsContent value="unread">
                <NotificationList
                  notifications={filteredNotifications}
                  handleMarkAsRead={handleMarkAsRead}
                  handleDeleteNotification={handleDeleteNotification}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface NotificationListProps {
  notifications: Notification[];
  handleMarkAsRead: (notificationId: string) => void;
  handleDeleteNotification: (notificationId: string) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  handleMarkAsRead,
  handleDeleteNotification,
}) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 mx-auto text-gray-400 mb-2" />
        <h3 className="text-lg font-medium">Belum ada notifikasi</h3>
        <p className="text-gray-500 mb-4">
          Anda akan menerima notifikasi saat ada pembaruan transaksi atau buku
        </p>
      </div>
    );
  }

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "transaction":
        return <Package className="h-4 w-4" />;
      case "book":
        return <CheckCircle className="h-4 w-4" />;
      case "system":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: Notification["type"]) => {
    switch (type) {
      case "transaction":
        return "Transaksi";
      case "book":
        return "Buku";
      case "system":
        return "Sistem";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-4">
      {notifications.map((notif) => (
        <Card key={notif.id} className="overflow-hidden">
          <CardContent className="p-6 flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(notif.type)}
                  <div>
                    <p className="text-gray-900 font-medium">{notif.message}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(notif.date).toLocaleDateString("id-ID")} •{" "}
                      {getTypeText(notif.type)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={notif.status === "unread" ? "default" : "outline"}
                  >
                    {notif.status === "unread" ? "Belum Dibaca" : "Dibaca"}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                {notif.status === "unread" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Tandai Dibaca
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteNotification(notif.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Hapus
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
