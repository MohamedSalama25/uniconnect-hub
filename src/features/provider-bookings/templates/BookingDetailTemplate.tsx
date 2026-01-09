import { useNavigate } from "react-router-dom";
import { ChevronRight, Calendar, User, Building, MessageSquare, Phone, Mail, MapPin, CreditCard, CheckCircle, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Booking } from "../data/mockBookings";

interface BookingDetailTemplateProps {
    booking: Booking;
}

export const BookingDetailTemplate = ({ booking }: BookingDetailTemplateProps) => {
    const navigate = useNavigate();

    const handleAction = (status: 'confirmed' | 'rejected') => {
        toast.success(status === 'confirmed' ? "تم قبول الحجز بنجاح" : "تم رفض الحجز");
        setTimeout(() => navigate('/provider/bookings'), 1500);
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            className="group hover:text-primary p-2 h-auto"
                            onClick={() => navigate(-1)}
                        >
                            <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                            العودة لقائمة الحجوزات
                        </Button>
                        <div className="flex items-center gap-3 mt-4">
                            <h1 className="text-3xl font-bold">تفاصيل الحجز #{booking.id}</h1>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'destructive'}
                                className={booking.status === 'confirmed' ? 'bg-green-500 hover:bg-green-600 text-base px-3 py-1' : 'text-base px-3 py-1'}>
                                {booking.status === 'confirmed' ? 'مؤكد' : booking.status === 'pending' ? 'قيد الانتظار' : 'مرفوض'}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> تم الطلب في {booking.date}
                        </p>
                    </div>

                    {booking.status === 'pending' && (
                        <div className="flex gap-3">
                            <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={() => handleAction('rejected')}>
                                <XCircle className="w-4 h-4 ml-2" /> رفض الطلب
                            </Button>
                            <Button onClick={() => handleAction('confirmed')}>
                                <CheckCircle className="w-4 h-4 ml-2" /> قبول الحجز
                            </Button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Tenant Info */}
                        <div className="bg-card border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 border-b pb-4">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <User className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold">معلومات المستأجر</h2>
                            </div>

                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                                <Avatar className="w-20 h-20">
                                    <AvatarImage src={booking.user.avatar} />
                                    <AvatarFallback className="text-2xl">{booking.user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-4 flex-1">
                                    <h3 className="text-2xl font-bold">{booking.user.name}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Mail className="w-4 h-4" />
                                            <span>{booking.user.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="w-4 h-4" />
                                            <span dir="ltr">{booking.user.phone}</span>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="outline" className="md:self-center">تواصل مع الطالب</Button>
                            </div>

                            {booking.message && (
                                <div className="mt-6 p-4 bg-muted/50 rounded-2xl border-r-4 border-primary">
                                    <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                                        <MessageSquare className="w-4 h-4 text-primary" /> رسالة من المستأجر:
                                    </div>
                                    <p className="text-sm leading-relaxed">{booking.message}</p>
                                </div>
                            )}
                        </div>

                        {/* Accommodation Info */}
                        <div className="bg-card border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 border-b pb-4">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <Building className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold">معلومات الوحدة السكنية</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                <div className="md:col-span-2 aspect-video rounded-2xl overflow-hidden border">
                                    <img src={booking.accommodation.image} alt={booking.accommodation.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="md:col-span-3 space-y-4">
                                    <h3 className="text-xl font-bold">{booking.accommodation.title}</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                            <MapPin className="w-4 h-4" />
                                            <span>{booking.accommodation.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">التكلفة الشهرية:</span>
                                            <span className="font-bold text-primary">{booking.accommodation.price} ج.م</span>
                                        </div>
                                    </div>
                                    <Button variant="link" className="p-0 h-auto text-primary font-bold" onClick={() => navigate(`/accommodation/${booking.accommodation.id}`)}>
                                        عرض صفحة السكن
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-card border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm lg:sticky lg:top-24">
                            <div className="flex items-center gap-3 border-b pb-4">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold">ملخص الدفع</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">الإيجار الشهري</span>
                                    <span className="font-medium">{booking.amount} ج.م</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">رسوم الخدمة (يتحملها الطالب)</span>
                                    <span className="font-medium">0 ج.م</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between items-center">
                                    <span className="font-bold">الإجمالي</span>
                                    <span className="text-2xl font-black text-primary">{booking.amount} ج.م</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground text-center bg-muted/50 py-2 rounded-lg">
                                    يتم تحصيل الإيجار مباشرة من الطالب عند التعاقد
                                </p>
                            </div>

                            <div className="pt-4 space-y-3">
                                <div className="flex items-center gap-2 text-xs text-green-600 font-bold bg-green-50 p-3 rounded-xl">
                                    <CheckCircle className="w-4 h-4 shrink-0" />
                                    نظام الحماية مفعل لهذا الحجز
                                </div>
                                <div className="flex items-center gap-2 text-xs text-blue-600 font-bold bg-blue-50 p-3 rounded-xl">
                                    <Clock className="w-4 h-4 shrink-0" />
                                    آخر موعد للتأكيد: خلال 24 ساعة
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
