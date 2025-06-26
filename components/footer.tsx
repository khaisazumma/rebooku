"use client";
import Link from "next/link";
import { BookOpen, Facebook, Twitter, Instagram } from "lucide-react";
import React from "react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">Rebooku</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Marketplace buku bekas terpercaya dengan review komunitas. Temukan
              buku impian Anda dengan harga terjangkau atau jual koleksi Anda
              dengan mudah.
            </p>
            <div className="flex space-x-4 mb-6 md:mb-0">
              <a href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              {[
                { label: "Katalog Buku", href: "/books" },
                { label: "Artikel & Review", href: "/articles" },
                { label: "Jual Buku", href: "/sell" },
                { label: "Panduan Penjual", href: "/seller-guide" },
                { label: "Tentang Kami", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 sm:mt-10 pt-4 sm:pt-6 text-center text-xs sm:text-sm text-gray-400">
          © 2024 Rebooku. Semua hak dilindungi undang-undang.
        </div>
      </div>
    </footer>
  );
}
