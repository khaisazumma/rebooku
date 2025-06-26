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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HelpCircle, Send, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  id: string;
  subject: string;
  message: string;
  date: string;
  userId: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function HelpDashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user || !user.id) {
      router.push("/login");
    }
  }, [user, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!contactForm.subject || contactForm.subject.length < 5) {
      toast({
        title: "Error",
        description: "Subjek harus diisi dan minimal 5 karakter.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    if (!contactForm.message || contactForm.message.length < 10) {
      toast({
        title: "Error",
        description: "Pesan harus diisi dan minimal 10 karakter.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    // Save to localStorage
    const newMessage: ContactMessage = {
      id: `msg${Date.now()}`,
      subject: contactForm.subject,
      message: contactForm.message,
      date: new Date().toISOString().split("T")[0],
      userId: user?.id || "",
    };

    const existingMessages = JSON.parse(
      localStorage.getItem(`rebooku_contact_messages_${user?.id}`) || "[]"
    ) as ContactMessage[];
    const updatedMessages = [...existingMessages, newMessage];
    localStorage.setItem(
      `rebooku_contact_messages_${user?.id}`,
      JSON.stringify(updatedMessages)
    );

    toast({
      title: "Pesan terkirim",
      description: "Pertanyaan Anda telah disimpan dan akan segera ditangani.",
    });

    setContactForm({ subject: "", message: "" });
    setIsSubmitting(false);
  };

  const faqs: FAQ[] = [
    {
      question: "Bagaimana cara menambahkan buku untuk dijual?",
      answer:
        "Untuk menambahkan buku, buka halaman 'Buku Saya' di dashboard, klik 'Tambah Buku', dan isi detail seperti judul, harga, dan kondisi buku. Pastikan Anda mengunggah foto buku yang jelas.",
    },
    {
      question: "Bagaimana cara mengubah metode pembayaran?",
      answer:
        "Kunjungi halaman 'Pembayaran' di dashboard, lalu pilih 'Tambah Metode Pembayaran' untuk menambahkan kartu kredit atau rekening bank. Anda juga dapat menghapus metode yang sudah ada.",
    },
    {
      question: "Mengapa saya tidak menerima notifikasi?",
      answer:
        "Periksa pengaturan notifikasi di halaman 'Pengaturan'. Pastikan opsi notifikasi email atau push diaktifkan. Anda juga dapat memeriksa folder spam/junk di email Anda.",
    },
    {
      question: "Bagaimana cara mengubah kata sandi?",
      answer:
        "Buka halaman 'Pengaturan', pilih tab 'Kata Sandi', masukkan kata sandi saat ini dan kata sandi baru, lalu konfirmasi. Pastikan kata sandi baru minimal 6 karakter.",
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Pusat Bantuan
              </h1>
              <p className="text-sm text-gray-600">
                Temukan jawaban atas pertanyaan Anda atau hubungi kami
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/seller-guide">
              <BookOpen className="mr-2 h-4 w-4" />
              Panduan Penjual
            </Link>
          </Button>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan Umum (FAQ)</CardTitle>
            <CardDescription>
              Jawaban atas pertanyaan umum tentang Rebooku
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Hubungi Kami</CardTitle>
            <CardDescription>
              Kirim pertanyaan Anda kepada tim dukungan Rebooku
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subjek</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    placeholder="Masukkan subjek pertanyaan Anda"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleInputChange}
                    placeholder="Jelaskan pertanyaan atau masalah Anda"
                    rows={5}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setContactForm({ subject: "", message: "" })}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
