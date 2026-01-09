import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ArrowRight,
    Calendar,
    User,
    Building,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    Clock,
    UserCheck,
    MapPin,
    AlertCircle
} from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from "@/components/ui/carousel";
import { toast } from "sonner";

// Mock data for posts (in a real app, this would come from an API based on id)
const mockPosts = {
    "1": {
        id: "1",
        title: "شقة مفروشة للإيجار - حي النرجس",
        author: "أحمد محمد",
        authorId: "user-1",
        university: "جامعة الملك سعود",
        phone: "+966 50 123 4567",
        email: "ahmed@example.com",
        date: "2026-01-08",
        status: "pending",
        type: "سكن",
        description: "شقة واسعة ومفروشة بالكامل تقع في حي النرجس الراقي، قريبة من جميع الخدمات والجامعة. تتكون من غرفتين وصالة ومطبخ وحمامين. الإيجار يشمل الكهرباء والماء والإنترنت.",
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&height=600&fit=crop",
            "https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=800&height=600&fit=crop",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&height=600&fit=crop",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&height=600&fit=crop"
        ]
    },
    "2": {
        id: "2",
        title: "توصيل طالبات من حي الملك فهد",
        author: "سارة علي",
        authorId: "user-2",
        university: "جامعة الأميرة نورة",
        phone: "+966 55 987 6543",
        email: "sara@example.com",
        date: "2026-01-07",
        status: "completed",
        type: "مواصلات",
        description: "سيارة حديثة ومكيفة لتوصيل الطالبات من حي الملك فهد إلى جامعة الأميرة نورة. الالتزام بالمواعيد والأمان هما أولويتنا. يوجد مكان لـ 3 طالبات إضافيات.",
        images: []
    }
};

const AdminPostDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // In a real app, you'd fetch the post by id
    const post = mockPosts[id as keyof typeof mockPosts] || mockPosts["1"];

    const handleApprove = () => {
        toast.success("تم قبول المنشور بنجاح");
        navigate("/admin/posts");
    };

    const handleReject = () => {
        toast.error("تم رفض المنشور");
        navigate("/admin/posts");
    };

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate("/admin/posts")}
                            className="rounded-full hover:bg-background shadow-sm"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">تفاصيل المنشور</h1>
                            <p className="text-muted-foreground mt-1">مراجعة بيانات المنشور وصاحبه قبل القبول</p>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button
                            variant="destructive"
                            className="flex-1 md:flex-none rounded-xl gap-2 font-bold px-6"
                            onClick={handleReject}
                        >
                            <XCircle className="w-4 h-4" /> رفض
                        </Button>
                        <Button
                            className="flex-1 md:flex-none rounded-xl gap-2 font-bold px-6 bg-green-600 hover:bg-green-700"
                            onClick={handleApprove}
                        >
                            <CheckCircle className="w-4 h-4" /> قبول
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content: Post Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
                            {post.images.length > 0 && (
                                <div className="w-full relative group">
                                    <Carousel className="w-full" opts={{ direction: 'rtl' }}>
                                        <CarouselContent>
                                            {post.images.map((image, index) => (
                                                <CarouselItem key={index}>
                                                    <div className="aspect-video w-full overflow-hidden">
                                                        <img
                                                            src={image}
                                                            alt={`${post.title} - ${index + 1}`}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    </div>
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        {post.images.length > 1 && (
                                            <>
                                                <CarouselPrevious className="right-4 left-auto bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
                                                <CarouselNext className="left-4 right-auto bg-white/20 hover:bg-white/40 border-none text-white backdrop-blur-md" />
                                            </>
                                        )}
                                    </Carousel>
                                    <div className="absolute top-4 right-4 z-10">
                                        <Badge className="bg-black/50 backdrop-blur-md border-none text-white px-3 py-1">
                                            {post.images.length} صور
                                        </Badge>
                                    </div>
                                </div>
                            )}
                            <CardHeader className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="outline" className="px-4 py-1 rounded-lg text-primary border-primary/20 bg-primary/5">
                                        {post.type}
                                    </Badge>
                                    <StatusBadge status={post.status} />
                                </div>
                                <CardTitle className="text-2xl md:text-4xl font-bold leading-tight">
                                    {post.title}
                                </CardTitle>
                                <div className="flex items-center gap-4 text-muted-foreground mt-4">
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <Calendar className="w-4 h-4" />
                                        <span>نُشر في {post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>حي النرجس، الرياض</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <div className="prose prose-slate max-w-none">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-primary" /> وصف المنشور
                                    </h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {post.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Info / Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="border-none shadow-lg rounded-2xl bg-primary/5">
                                <CardContent className="p-6">
                                    <h4 className="font-bold mb-3">المرافق المتوفرة</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {['إنترنت', 'مكيف', 'مطبخ', 'أثاث'].map(f => (
                                            <Badge key={f} variant="secondary" className="rounded-md">{f}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-none shadow-lg rounded-2xl bg-amber-500/5">
                                <CardContent className="p-6">
                                    <h4 className="font-bold mb-3">شروط الإيجار</h4>
                                    <p className="text-sm text-muted-foreground italic">يجب تقديم بطاقة جامعية سارية المفعول عند التعاقد.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Sidebar: Author Details */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden sticky top-8">
                            <div className="h-24 bg-gradient-to-r from-primary to-primary-foreground/20" />
                            <CardContent className="p-8 -mt-12">
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div className="relative">
                                        <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} />
                                            <AvatarFallback>{post.author[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-background w-6 h-6 rounded-full flex items-center justify-center">
                                            <UserCheck className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{post.author}</h3>
                                        <p className="text-sm text-muted-foreground">{post.university}</p>
                                    </div>
                                    <div className="w-full pt-4 space-y-3">
                                        <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl transition-colors hover:bg-muted">
                                            <Phone className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-medium" dir="ltr">{post.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl transition-colors hover:bg-muted">
                                            <Mail className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-medium">{post.email}</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full rounded-xl gap-2 font-bold border-primary/20 hover:bg-primary/5">
                                        <User className="w-4 h-4" /> فحص الملف الشخصي
                                    </Button>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 p-6 flex flex-col gap-4 border-t">
                                <div className="flex justify-between w-full text-sm">
                                    <span className="text-muted-foreground">تاريخ الانضمام</span>
                                    <span className="font-bold">سبتمبر 2024</span>
                                </div>
                                <div className="flex justify-between w-full text-sm">
                                    <span className="text-muted-foreground">إجمالي المنشورات</span>
                                    <span className="font-bold text-primary">12 منشور</span>
                                </div>
                                <div className="flex justify-between w-full text-sm">
                                    <span className="text-muted-foreground">الحساب موثق</span>
                                    <Badge className="bg-green-100 text-green-700 border-none">نعم</Badge>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    if (status === "pending") return <Badge className="bg-amber-500 hover:bg-amber-600 border-none gap-1 px-4 py-1 rounded-full"><Clock className="w-3 h-3" /> قيد المراجعة</Badge>;
    if (status === "completed") return <Badge className="bg-green-500 hover:bg-green-600 border-none gap-1 px-4 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> مقبول</Badge>;
    return <Badge className="bg-red-500 hover:bg-red-600 border-none gap-1 px-4 py-1 rounded-full"><XCircle className="w-3 h-3" /> مرفوض</Badge>;
};

export default AdminPostDetailsPage;
