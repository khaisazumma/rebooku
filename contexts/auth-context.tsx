"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("rebooku_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    // Initialize with default admin if no users exist
    const users = JSON.parse(localStorage.getItem("rebooku_users") || "[]");
    if (users.length === 0) {
      const defaultUsers = [
        {
          id: "admin",
          name: "Admin Rebooku",
          email: "admin@rebooku.com",
          password: "admin123",
          role: "admin",
          avatar:
            "https://i.pinimg.com/736x/9c/3d/dd/9c3ddd0d3ed0556b469f3705983a4d9b.jpg",
          phone: "081234567890",
          address: "Jakarta, Indonesia",
        },
        {
          id: "user1",
          name: "Khaisa Zumma",
          email: "user@rebooku.com",
          password: "user123",
          role: "user",
          avatar:
            "https://i.pinimg.com/736x/9c/3d/dd/9c3ddd0d3ed0556b469f3705983a4d9b.jpg",
          phone: "081234567891",
          address: "Bandung, Jawa Barat",
        },
      ];
      localStorage.setItem("rebooku_users", JSON.stringify(defaultUsers));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulasi login
    const users = JSON.parse(localStorage.getItem("rebooku_users") || "[]");
    const foundUser = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("rebooku_user", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem("rebooku_users") || "[]");

    if (users.find((u: any) => u.email === email)) {
      return false; // Email sudah terdaftar
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: "user" as const,
      avatar:
        "https://i.pinimg.com/736x/9c/3d/dd/9c3ddd0d3ed0556b469f3705983a4d9b.jpg",
    };

    users.push(newUser);
    localStorage.setItem("rebooku_users", JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("rebooku_user", JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rebooku_user");
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("rebooku_user", JSON.stringify(updatedUser));

      // Update di users array juga
      const users = JSON.parse(localStorage.getItem("rebooku_users") || "[]");
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...data };
        localStorage.setItem("rebooku_users", JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
