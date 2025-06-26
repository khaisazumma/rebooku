"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  User,
  Package,
  Heart,
  Settings,
  BookOpen,
  ShoppingCart,
  CreditCard,
  Bell,
  HelpCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Profil Saya",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      title: "Pesanan Saya",
      href: "/dashboard/orders",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Buku Favorit",
      href: "/dashboard/favorites",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      title: "Buku Saya",
      href: "/dashboard/my-books",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      title: "Keranjang",
      href: "/cart",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "Pembayaran",
      href: "/dashboard/payment",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      title: "Notifikasi",
      href: "/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      title: "Pengaturan",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Bantuan",
      href: "/dashboard/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ];

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-3 mb-6 p-2">
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <img
            src={
              user?.avatar && user.avatar.length > 0
                ? user.avatar
                : "https://i.pinimg.com/736x/9c/3d/dd/9c3ddd0d3ed0556b469f3705983a4d9b.jpg"
            }
            alt={user?.name || "User"}
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <h3 className="font-medium">{user?.name}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors",
              pathname === item.href
                ? "bg-blue-50 text-blue-600 font-medium"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </Card>
  );
}
