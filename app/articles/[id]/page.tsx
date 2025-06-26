"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Star,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  Calendar,
  Clock,
  BookOpen,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
    bio: string;
  };
  bookId?: string;
  bookTitle?: string;
  bookAuthor?: string;
  bookImage?: string;
  rating?: number;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  views: number;
  comments: number;
  likes: number;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
  likes: number;
  replies: Comment[];
}

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock article data
    const mockArticle: Article = {
      id: params.id as string,
      title: "Review: Laskar Pelangi - Karya Masterpiece Andrea Hirata",
      content: `
        <p>Laskar Pelangi adalah novel yang tidak hanya menghibur, tetapi juga memberikan pesan mendalam tentang pentingnya pendidikan dan semangat pantang menyerah. Andrea Hirata berhasil menghadirkan kisah yang menyentuh hati tentang sepuluh anak Melayu Belitung yang berjuang untuk mendapatkan pendidikan di tengah keterbatasan.</p>

        <h3>Kekuatan Narasi</h3>
        <p>Yang membuat Laskar Pelangi istimewa adalah kemampuan Andrea Hirata dalam menyajikan cerita dengan gaya bertutur yang mengalir natural. Penggunaan sudut pandang orang pertama membuat pembaca seolah-olah ikut merasakan pengalaman Ikal dan teman-temannya di SD Muhammadiyah.</p>

        <h3>Karakter yang Memorable</h3>
        <p>Setiap karakter dalam novel ini memiliki keunikan tersendiri. Dari Lintang yang jenius namun miskin, Mahar yang eksentrik dan berbakat seni, hingga Bu Muslimah yang berdedikasi tinggi sebagai guru. Mereka semua digambarkan dengan detail yang membuat pembaca mudah terhubung secara emosional.</p>

        <h3>Pesan Universal</h3>
        <p>Meskipun berlatar Belitung, pesan yang disampaikan dalam Laskar Pelangi bersifat universal. Novel ini mengajarkan bahwa pendidikan adalah kunci untuk mengubah nasib, dan bahwa semangat pantang menyerah dapat mengalahkan segala keterbatasan.</p>

        <h3>Kritik</h3>
        <p>Jika ada yang bisa dikritik, mungkin beberapa bagian terasa terlalu sentimental. Namun hal ini justru menjadi kekuatan novel ini dalam menyentuh emosi pembaca.</p>

        <h3>Kesimpulan</h3>
        <p>Laskar Pelangi adalah novel yang wajib dibaca oleh siapa saja yang ingin memahami kekuatan pendidikan dan semangat juang. Andrea Hirata telah menciptakan karya yang tidak hanya menghibur, tetapi juga menginspirasi jutaan pembaca Indonesia.</p>
      `,
      author: {
        name: "Khaisa Zumma",
        avatar:
          "https://i.pinimg.com/236x/04/19/25/0419256d054e2bd00229102072fd898a.jpg",
        role: "Book Reviewer",
        bio: "Pecinta sastra Indonesia dengan pengalaman 10 tahun dalam dunia literasi. Telah mereview lebih dari 500 buku Indonesia dan internasional.",
      },
      bookId: "1",
      bookTitle: "Laskar Pelangi",
      bookAuthor: "Andrea Hirata",
      bookImage:
        "https://media.tampang.com/tm_images/article/202407/desain-tanpalm3tbzj0ye95c8xl.jpg",
      rating: 5,
      category: "Review Buku",
      tags: ["Novel Indonesia", "Pendidikan", "Inspiratif", "Andrea Hirata"],
      publishDate: "2024-05-28",
      readTime: 8,
      views: 1250,
      comments: 45,
      likes: 89,
    };

    const mockComments: Comment[] = [
      {
        id: "1",
        userId: "1",
        userName: "Ahmad Rizki",
        userAvatar:
          "https://i.pinimg.com/236x/97/ef/24/97ef241b207714a81b26d15d7371dd10.jpg",
        content:
          "Review yang sangat mendalam! Saya juga sangat terkesan dengan novel ini. Andrea Hirata memang luar biasa dalam menggambarkan perjuangan pendidikan di daerah terpencil.",
        date: "2024-05-29",
        likes: 12,
        replies: [
          {
            id: "1-1",
            userId: "2",
            userName: "Sari Dewi",
            userAvatar:
              "https://i.pinimg.com/236x/7c/75/e9/7c75e946872e3ba417ef3c5e06688c3b.jpg",
            content:
              "Terima kasih! Memang novel ini punya kekuatan emosional yang luar biasa ya.",
            date: "2024-05-29",
            likes: 3,
            replies: [],
          },
        ],
      },
      {
        id: "2",
        userId: "3",
        userName: "Maya Putri",
        userAvatar:
          "https://i.pinimg.com/236x/7c/75/e9/7c75e946872e3ba417ef3c5e06688c3b.jpg",
        content:
          "Setuju banget dengan analisisnya. Karakter Lintang memang paling berkesan buat saya. Jenius tapi tetap rendah hati.",
        date: "2024-05-29",
        likes: 8,
        replies: [],
      },
      {
        id: "3",
        userId: "4",
        userName: "Budi Santoso",
        userAvatar:
          "https://i.pinimg.com/236x/b6/e4/08/b6e4086596b50da813428f1bbce8deb0.jpg",
        content:
          "Novel ini memang fenomenal. Sudah berkali-kali baca tapi tetap terharu setiap kali. Terima kasih reviewnya yang detail!",
        date: "2024-05-28",
        likes: 15,
        replies: [],
      },
    ];

    setArticle(mockArticle);
    setComments(mockComments);
    setLoading(false);

    // Increment view count
    setTimeout(() => {
      if (mockArticle) {
        setArticle((prev) =>
          prev ? { ...prev, views: prev.views + 1 } : null
        );
      }
    }, 2000);
  }, [params.id]);

  const handleLike = () => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Silakan login untuk menyukai artikel",
        variant: "destructive",
      });
      return;
    }

    setIsLiked(!isLiked);
    setArticle((prev) =>
      prev
        ? {
            ...prev,
            likes: isLiked ? prev.likes - 1 : prev.likes + 1,
          }
        : null
    );

    toast({
      title: isLiked ? "Like dibatalkan" : "Artikel disukai",
      description: isLiked
        ? "Anda membatalkan like pada artikel ini"
        : "Terima kasih telah menyukai artikel ini",
    });
  };

  const handleSubmitComment = () => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Silakan login untuk memberikan komentar",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Komentar kosong",
        description: "Silakan tulis komentar Anda",
        variant: "destructive",
      });
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || "/placeholder.svg?height=40&width=40",
      content: newComment,
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      replies: [],
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");

    if (article) {
      setArticle((prev) =>
        prev ? { ...prev, comments: prev.comments + 1 } : null
      );
    }

    toast({
      title: "Komentar berhasil ditambahkan",
      description: "Terima kasih atas komentar Anda",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link disalin",
        description: "Link artikel telah disalin ke clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium">Artikel tidak ditemukan</h3>
              <p className="text-gray-500 mb-4">
                Artikel yang Anda cari tidak ditemukan
              </p>
              <Button asChild>
                <Link href="/articles">Kembali ke Artikel</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>

        {/* Article Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center space-x-2 mb-4">
              <Badge>{article.category}</Badge>
              {article.rating && (
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= article.rating!
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium">
                    {article.rating}/5
                  </span>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Book Info */}
            {article.bookTitle && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-6">
                <img
                  src={article.bookImage || "/placeholder.svg"}
                  alt={article.bookTitle}
                  className="w-16 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="font-semibold">{article.bookTitle}</h3>
                  <p className="text-gray-600">oleh {article.bookAuthor}</p>
                  <Button variant="link" className="p-0 h-auto" asChild>
                    <Link href={`/books/${article.bookId}`}>
                      Lihat Detail Buku
                    </Link>
                  </Button>
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={article.author.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {article.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{article.author.name}</h3>
                  <p className="text-sm text-gray-600">{article.author.role}</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 text-right">
                <div className="flex items-center mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(article.publishDate).toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {article.readTime} menit baca
                </div>
              </div>
            </div>

            {/* Article Stats */}
            <div className="flex items-center justify-between py-4 border-t border-b">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {article.views} views
                </span>
                <span className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {article.comments} komentar
                </span>
                <span className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {article.likes} likes
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleLike}>
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      isLiked ? "text-red-500 fill-current" : ""
                    }`}
                  />
                  {isLiked ? "Disukai" : "Suka"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            <div className="mt-8 pt-6 border-t">
              <h4 className="font-medium mb-3">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author Bio */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Tentang Penulis</h3>
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={article.author.avatar || "/placeholder.svg"}
                />
                <AvatarFallback>{article.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold">{article.author.name}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  {article.author.role}
                </p>
                <p className="text-sm text-gray-700">{article.author.bio}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Komentar ({comments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Add Comment */}
            {user ? (
              <div className="mb-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Tulis komentar Anda..."
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <Button onClick={handleSubmitComment}>
                        Kirim Komentar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600 mb-2">
                  Silakan login untuk memberikan komentar
                </p>
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id}>
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage
                        src={comment.userAvatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {comment.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">{comment.userName}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.date).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{comment.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button className="flex items-center hover:text-blue-600">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {comment.likes}
                        </button>
                        <button className="hover:text-blue-600">Balas</button>
                      </div>

                      {/* Replies */}
                      {comment.replies.length > 0 && (
                        <div className="mt-4 ml-6 space-y-4">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="flex items-start space-x-3"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={reply.userAvatar || "/placeholder.svg"}
                                />
                                <AvatarFallback>
                                  {reply.userName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {reply.userName}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(reply.date).toLocaleDateString(
                                      "id-ID"
                                    )}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700">
                                  {reply.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Separator className="mt-6" />
                </div>
              ))}
            </div>

            {comments.length === 0 && (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium">Belum ada komentar</h3>
                <p className="text-gray-500">
                  Jadilah yang pertama memberikan komentar
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
