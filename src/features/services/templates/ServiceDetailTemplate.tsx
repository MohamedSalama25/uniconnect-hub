import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    MapPin,
    Phone,
    Clock,
    Star,
    Globe,
    Share2,
    Navigation,
    Utensils,
    Pill,
    Hospital,
    Shirt,
    Bus
} from "lucide-react";
import type { Service } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface ServiceDetailTemplateProps {
    service: Service | undefined;
}

const categoryConfig: Record<Service['category'], {
    icon: any;
    label: string;
    color: string;
    bg: string;
}> = {
    restaurant: { icon: Utensils, label: 'مطعم', color: 'text-accent', bg: 'bg-accent/10' },
    pharmacy: { icon: Pill, label: 'صيدلية', color: 'text-success', bg: 'bg-success/10' },
    hospital: { icon: Hospital, label: 'مستشفى', color: 'text-destructive', bg: 'bg-destructive/10' },
    laundry: { icon: Shirt, label: 'مغسلة', color: 'text-primary', bg: 'bg-primary/10' },
    transportation: { icon: Bus, label: 'مواصلات', color: 'text-secondary', bg: 'bg-secondary/10' },
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // Distance in meters
};

export const ServiceDetailTemplate = ({ service }: ServiceDetailTemplateProps) => {
    const navigate = useNavigate();

    // Retrieve user location from localStorage
    const savedLocation = localStorage.getItem('location');
    const userLocation = savedLocation ? JSON.parse(savedLocation) : null;

    if (!service) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                    <h2 className="text-2xl font-bold">الخدمة غير موجودة</h2>
                    <Button onClick={() => navigate("/services")}>العودة للخدمات</Button>
                </div>
            </DashboardLayout>
        );
    }

    const config = categoryConfig[service.category];
    const CategoryIcon = config.icon;

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                {/* Header Navigation */}
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
                        <h1 className="text-2xl md:text-3xl font-bold">{service.name}</h1>
                        <p className="text-muted-foreground mt-1">تفاصيل الخدمة والموقع</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
                            <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center relative">
                                <div className={cn("p-8 rounded-full shadow-2xl", config.bg)}>
                                    <CategoryIcon className={cn("w-24 h-24", config.color)} />
                                </div>
                                <div className="absolute bottom-6 right-6 flex gap-2">
                                    <Button variant="secondary" className="rounded-xl gap-2 backdrop-blur-md bg-white/50">
                                        <Share2 className="w-4 h-4" /> شارك
                                    </Button>
                                    <Button variant="secondary" className="rounded-xl gap-2 backdrop-blur-md bg-white/50">
                                        <Globe className="w-4 h-4" /> الموقع الإلكتروني
                                    </Button>
                                </div>
                            </div>
                            <CardHeader className="p-8">
                                <div className="flex justify-between items-start mb-4">
                                    <Badge variant="outline" className="px-4 py-1 rounded-lg">
                                        {config.label}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-accent bg-accent/10 px-3 py-1 rounded-full">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-bold">{service.rating}</span>
                                    </div>
                                </div>
                                <CardTitle className="text-3xl font-bold">حول {service.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-8 pb-8">
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    هذه الخدمة متاحة للطلاب وتوفر خدمات عالية الجودة في منطقة {service.address}.
                                    نحن نسعى دائماً لتقديم أفضل تجربة لعملائنا من الطلاب.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Location Card */}
                        <Card className="border-none shadow-lg rounded-3xl overflow-hidden">
                            <CardHeader className="p-6 pb-0">
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" /> الموقع الجغرافي
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="h-48 bg-muted rounded-2xl mb-4 flex items-center justify-center border-2 border-dashed">
                                    <span className="text-muted-foreground">خريطة مصغرة للموقع</span>
                                </div>
                                <div className="flex justify-between items-center bg-primary/5 p-4 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Navigation className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{service.address}</p>
                                            {userLocation && service.lat && service.lng ? (
                                                <p className="text-sm text-primary font-semibold">
                                                    📍 {calculateDistance(userLocation.lat, userLocation.lng, service.lat, service.lng)} متر منك
                                                </p>
                                            ) : userLocation ? (
                                                <p className="text-sm text-muted-foreground">المسافة: غير محدد</p>
                                            ) : null}
                                        </div>
                                    </div>
                                    <Button className="rounded-xl px-6">الحصول على الاتجاهات</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
                            <CardHeader className="p-8 bg-card border-b">
                                <CardTitle className="text-xl font-bold">معلومات التواصل</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center transition-colors group-hover:bg-primary/20">
                                            <Phone className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">رقم الهاتف</p>
                                            <p className="font-bold text-lg" dir="ltr">{service.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 group">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center transition-colors group-hover:bg-amber-500/20">
                                            <Clock className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">ساعات العمل</p>
                                            <p className="font-bold text-lg">{service.hours}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-4 border-t">
                                    <Button className="w-full rounded-2xl py-6 text-lg font-bold shadow-lg shadow-primary/20 h-auto">
                                        <Phone className="ml-2 w-5 h-5" /> اتصل الآن
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Social / Reviews Brief */}
                        <Card className="border-none shadow-lg rounded-3xl bg-primary text-primary-foreground overflow-hidden relative">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
                            <CardContent className="p-6 relative z-10 text-center">
                                <h4 className="font-bold mb-2">هل زرت هذا المكان؟</h4>
                                <p className="text-sm opacity-80 mb-4">شارك تجربتك مع زملائك الطلاب وساعدهم في اختيار الأفضل.</p>
                                <div className="flex justify-center gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-white opacity-40 hover:opacity-100 cursor-pointer" />)}
                                </div>
                                <Button variant="secondary" className="w-full rounded-xl bg-white text-primary hover:bg-white/90">أضف تقييماً</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
