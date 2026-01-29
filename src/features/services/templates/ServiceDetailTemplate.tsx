import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    MapPin,
    Phone,
    Clock,
    Star,
    Share2,
    User,
    Info,
    MessageCircle,
    StarHalf,
    Navigation
} from "lucide-react";
import { UserProfileTrigger } from "@/components/globalComponents/UserProfileTrigger";
import { Service, TimeSpan } from "@/features/services/types/service.types";
import { LocationViewer } from "@/components/globalComponents/LocationViewer";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { AddServiceRatingForm } from "../components/AddServiceRatingForm";
import { ServiceRatingsList } from "../components/ServiceRatingsList";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { serviceService } from "../services/service.service";
import { SendMessageDialog } from "@/components/globalComponents/SendMessageDialog";

interface ServiceDetailTemplateProps {
    service: Service | undefined;
}

export const ServiceDetailTemplate = ({ service }: ServiceDetailTemplateProps) => {
    const navigate = useNavigate();
    const { user, fullProfile } = useAuthStore();
    const currentUserId = fullProfile?.id || (user as any)?.id;
    const isOwner = service ? String(service.createdUser?.id) === String(currentUserId) : false;

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("تم نسخ رابط الخدمة بنجاح");
    };

    const [isMessageOpen, setIsMessageOpen] = useState(false);

    const handleOpenMessage = () => {
        if (!currentUserId) {
            toast.error("يرجى تسجيل الدخول أولاً لإرسال رسالة");
            navigate("/login");
            return;
        }
        setIsMessageOpen(true);
    };

    const { data: ratings } = useQuery({
        queryKey: ["service-ratings", service?.id],
        queryFn: () => service?.id ? serviceService.getRatings(service.id) : Promise.resolve([]),
        enabled: !!service?.id
    });

    const hasAlreadyRated = ratings?.some(r => String(r.createdUser?.id) === String(currentUserId));
    const showRatingForm = !isOwner && !hasAlreadyRated && currentUserId;

    const formatTime = (time: any) => {
        if (!time) return "غير محدد";
        if (typeof time === 'string') return time.split(':').slice(0, 2).join(':');

        const hours = time.hours ?? 0;
        const minutes = (time.minutes ?? 0).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    if (!service) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <div className="bg-red-50 p-6 rounded-3xl border border-red-100 max-w-md w-full text-center">
                        <h2 className="text-2xl font-bold text-red-600">الخدمة غير موجودة</h2>
                        <Button className="mt-4" onClick={() => navigate("/services")}>العودة للخدمات</Button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                {/* Header Navigation */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(-1)}
                            className="rounded-full hover:bg-background shadow-sm"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tight">{service.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">
                                    {service.serviceCategoryName}
                                </Badge>
                                <p className="text-muted-foreground text-sm font-medium">تفاصيل الخدمة والموقع</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl gap-2 backdrop-blur-md bg-white/50" onClick={handleShare}>
                            <Share2 className="w-4 h-4" /> مشاركة
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Map Header Area */}
                        <Card className="border-none shadow-xl overflow-hidden rounded-[2.5rem] bg-background">
                            <div className="h-[600px] w-full relative group">
                                <LocationViewer
                                    lat={service.latitude}
                                    lng={service.longitude}
                                    title={service.name}
                                    height="600px"
                                    hideHeader={true}
                                />
                                <div className="absolute top-8 right-8 z-10 flex gap-2">
                                    <Button
                                        onClick={() => window.open(`https://www.google.com/maps?q=${service.latitude},${service.longitude}`, '_blank')}
                                        className="rounded-2xl shadow-2xl gap-2 h-14 bg-white text-primary hover:bg-white/90 font-black px-8 border-none active:scale-95 transition-all"
                                    >
                                        <Navigation className="w-5 h-5 text-teal-600" />
                                        <span>احصل على الاتجاهات</span>
                                    </Button>
                                </div>
                            </div>
                            <CardHeader className="p-10 pt-16 relative bg-background rounded-t-[3rem] -mt-16 z-20 shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.1)]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-bold">4.8</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-primary border-b pb-4 mb-6">
                                    <Info className="w-6 h-6" />
                                    <h2 className="text-2xl font-black uppercase tracking-tight">حول {service.name}</h2>
                                </div>
                                <div className="space-y-4">
                                    <p className="text-lg text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center gap-2 bg-muted/30 p-4 rounded-2xl border border-border/50">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <span className="font-bold text-lg">{service.address}</span>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        {/* Ratings Section */}
                        <div className="space-y-8">
                            <ServiceRatingsList serviceId={service.id} />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Provider Card */}
                        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-background">
                            <CardHeader className="p-8 bg-primary/5 border-b border-primary/10">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <User className="w-6 h-6 text-primary" /> مقدم الخدمة
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8">
                                <UserProfileTrigger
                                    name={service.createdUser?.username || "غير معروف"}
                                    avatar={service.createdUser?.profilePictureUrl}
                                    user={service.createdUser}
                                    userId={service.createdUser?.id}
                                    className="w-full"
                                >
                                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-3xl hover:bg-muted/50 transition-all cursor-pointer group border border-border/50">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm overflow-hidden">
                                            {service.createdUser?.profilePictureUrl ? (
                                                <img src={service.createdUser.profilePictureUrl} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                (service.createdUser?.username || "م")[0]
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-black text-lg">{service.createdUser?.username || "غير معروف"}</p>
                                            <p className="text-sm text-muted-foreground font-bold">{service.createdUser?.universityName || "طالب"}</p>
                                        </div>
                                    </div>
                                </UserProfileTrigger>
                            </CardContent>
                        </Card>

                        {/* Contact Card */}
                        <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-background">
                            <CardHeader className="p-8 bg-card border-b border-border/50">
                                <CardTitle className="text-xl font-black">معلومات التواصل</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-5 font-bold">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center transition-all group-hover:bg-primary/20 border border-primary/20">
                                            <Phone className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                                            <p className="font-black text-lg" dir="ltr">{service.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center transition-all group-hover:bg-amber-500/20 border border-amber-500/20">
                                            <Clock className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">ساعات العمل</p>
                                            <p className="font-black text-lg">
                                                {formatTime(service.workingFrom)} - {formatTime(service.workingTo)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={cn("pt-6 border-t border-border/50 grid gap-3", isOwner ? "grid-cols-1" : "grid-cols-1")}>
                                    <Button
                                        className="w-full rounded-2xl h-14 text-lg font-black shadow-lg shadow-primary/20 bg-primary transition-transform active:scale-[0.98]"
                                        onClick={() => window.location.href = `tel:${service.phone}`}
                                    >
                                        <Phone className="ml-2 w-5 h-5" /> اتصل الآن
                                    </Button>
                                    {!isOwner && (
                                        <Button
                                            variant="outline"
                                            className="w-full rounded-2xl h-14 text-lg font-black border-2 border-primary/20 hover:bg-primary/5 transition-all"
                                            onClick={handleOpenMessage}
                                        >
                                            <MessageCircle className="ml-2 w-5 h-5 text-primary" /> تواصل مباشر
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <SendMessageDialog
                            open={isMessageOpen}
                            onOpenChange={setIsMessageOpen}
                            recipientId={service.createdUser?.id}
                            recipientName={service.createdUser?.username || "صاحب الخدمة"}
                        />

                        {/* Rating Prompt Card - Sidebar */}
                        {showRatingForm && (
                            <Card className="border-none shadow-2xl rounded-[2rem] bg-teal-900 text-primary-foreground overflow-hidden relative group hover:scale-[1.01] transition-all duration-500">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 -translate-y-16 blur-2xl group-hover:bg-white/10 transition-all duration-700" />
                                <CardContent className="p-6 relative z-10 text-center space-y-4">
                                    <div className="space-y-1">
                                        <h4 className="font-black text-lg tracking-tight">هل جربت هذه الخدمة؟</h4>
                                        <p className="text-xs opacity-70 font-bold leading-relaxed px-4">شاركنا تقييمك لمساعدة زملائك الطلاب.</p>
                                    </div>

                                    <AddServiceRatingForm serviceId={service.id} variant="small" />
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
