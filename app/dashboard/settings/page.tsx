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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell, Save } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface UserSettings {
  name: string;
  email: string;
  photoURL: string | null;
  notificationPreferences: {
    email: boolean;
    push: boolean;
  };
}

export default function SettingsDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    photoURL: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    push: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user settings from localStorage or mock data
  useEffect(() => {
    if (!user || !user.id) {
      router.push("/login");
      return;
    }

    const savedSettings = localStorage.getItem(`rebooku_settings_${user.id}`);
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings) as UserSettings;
      setProfileForm({
        name: parsedSettings.name,
        email: parsedSettings.email,
        photoURL: parsedSettings.photoURL || "",
      });
      setNotificationPreferences(parsedSettings.notificationPreferences);
    } else {
      const defaultSettings: UserSettings = {
        name: user.name || "Pengguna Rebooku",
        email: user.email || "pengguna@rebooku.com",
        photoURL: user.photoURL || null,
        notificationPreferences: {
          email: true,
          push: true,
        },
      };
      setProfileForm({
        name: defaultSettings.name,
        email: defaultSettings.email,
        photoURL: defaultSettings.photoURL || "",
      });
      setNotificationPreferences(defaultSettings.notificationPreferences);
      localStorage.setItem(
        `rebooku_settings_${user.id}`,
        JSON.stringify(defaultSettings)
      );
    }
  }, [user, router]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (name: string, value: string) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [name]: value === "true",
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!profileForm.name || profileForm.name.length < 2) {
      toast({
        title: "Error",
        description: "Nama harus diisi dan minimal 2 karakter.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    if (
      !profileForm.email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)
    ) {
      toast({
        title: "Error",
        description: "Email tidak valid.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Save to localStorage
    const updatedSettings: UserSettings = {
      name: profileForm.name,
      email: profileForm.email,
      photoURL: profileForm.photoURL || null,
      notificationPreferences,
    };
    localStorage.setItem(
      `rebooku_settings_${user?.id}`,
      JSON.stringify(updatedSettings)
    );

    toast({
      title: "Profil diperbarui",
      description: "Pengaturan profil Anda telah disimpan.",
    });
    setIsSubmitting(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Kata sandi baru harus minimal 6 karakter.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Error",
        description: "Konfirmasi kata sandi tidak cocok.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate password update (no actual backend)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    toast({
      title: "Kata sandi diperbarui",
      description: "Kata sandi Anda telah diubah.",
    });
    setIsSubmitting(false);
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save to localStorage
    const updatedSettings: UserSettings = {
      name: profileForm.name,
      email: profileForm.email,
      photoURL: profileForm.photoURL || null,
      notificationPreferences,
    };
    localStorage.setItem(
      `rebooku_settings_${user?.id}`,
      JSON.stringify(updatedSettings)
    );

    toast({
      title: "Preferensi notifikasi diperbarui",
      description: "Pengaturan notifikasi Anda telah disimpan.",
    });
    setIsSubmitting(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
              <p className="text-sm text-gray-600">
                Kelola profil, kata sandi, dan preferensi notifikasi Anda
              </p>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan Akun</CardTitle>
            <CardDescription>
              Perbarui informasi akun dan preferensi Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile">
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Profil</TabsTrigger>
                <TabsTrigger value="password">Kata Sandi</TabsTrigger>
                <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        placeholder="Masukkan nama Anda"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        placeholder="Masukkan email Anda"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photoURL">URL Foto Profil</Label>
                      <Input
                        id="photoURL"
                        name="photoURL"
                        value={profileForm.photoURL}
                        onChange={handleProfileChange}
                        placeholder="Masukkan URL foto profil"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Menyimpan..." : "Simpan Profil"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="password">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        Kata Sandi Saat Ini
                      </Label>
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Masukkan kata sandi saat ini"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Masukkan kata sandi baru"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Konfirmasi Kata Sandi
                      </Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Konfirmasi kata sandi baru"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      <Lock className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Menyimpan..." : "Ubah Kata Sandi"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="notifications">
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emailNotification">
                        Notifikasi Email
                      </Label>
                      <Select
                        value={notificationPreferences.email.toString()}
                        onValueChange={(value) =>
                          handleNotificationChange("email", value)
                        }
                      >
                        <SelectTrigger id="emailNotification">
                          <SelectValue placeholder="Pilih preferensi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Aktif</SelectItem>
                          <SelectItem value="false">Nonaktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pushNotification">Notifikasi Push</Label>
                      <Select
                        value={notificationPreferences.push.toString()}
                        onValueChange={(value) =>
                          handleNotificationChange("push", value)
                        }
                      >
                        <SelectTrigger id="pushNotification">
                          <SelectValue placeholder="Pilih preferensi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Aktif</SelectItem>
                          <SelectItem value="false">Nonaktif</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      <Bell className="mr-2 h-4 w-4" />
                      {isSubmitting ? "Menyimpan..." : "Simpan Preferensi"}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
