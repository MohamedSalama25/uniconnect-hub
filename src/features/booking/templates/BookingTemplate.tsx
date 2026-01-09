import { useNavigate } from "react-router-dom";
import { ChevronRight, Calendar, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Accommodation } from "@/data/mockData";
import { currentStudent } from "@/data/mockData";
import { useState } from "react";

interface BookingTemplateProps {
    accommodation: Accommodation;
}

export const BookingTemplate = ({ accommodation }: BookingTemplateProps) => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Split full name for form
    const [firstName, ...lastNameParts] = currentStudent.name.split(' ');
    const lastName = lastNameParts.join(' ');

    const handleBooking = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("تم إرسال طلب الحجز بنجاح!", {
                description: "سيتواصل معك المالك قريباً لتأكيد الحجز."
            });
            navigate("/accommodations");
        }, 2000);
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 space-y-8 animate-fade-in">
                {/* Header / Back Button */}
                <div>
                    <Button
                        variant="ghost"
                        className="group hover:text-primary pl-4 -ml-2 h-auto py-2"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                        العودة للتفاصيل
                    </Button>
                    <h1 className="text-3xl font-bold mt-4">إتمام عملية الحجز</h1>
                    <p className="text-muted-foreground">قم بمراجعة تفاصيل الحجز وإدخال بياناتك لإتمام العملية.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Booking Form */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Personal Info */}
                        <div className="bg-card border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3 border-b pb-4">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold">بياناتك الشخصية</h2>
                            </div>

                            <form id="booking-form" onSubmit={handleBooking} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">الاسم الأول</Label>
                                        <Input id="firstName" defaultValue={firstName} required className="h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">الاسم الأخير</Label>
                                        <Input id="lastName" defaultValue={lastName} required className="h-12" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">البريد الإلكتروني الجامعي</Label>
                                    <Input id="email" type="email" placeholder="student@university.edu.eg" required className="h-12 dir-ltr text-right" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">رقم الهاتف</Label>
                                    <Input id="phone" type="tel" defaultValue={currentStudent.phone} required className="h-12 dir-ltr text-right" />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">رسالة للمالك (اختياري)</Label>
                                    <textarea
                                        id="message"
                                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        placeholder="عرف نفسك باختصار..."
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Payment Info Mockup */}
                        <div className="bg-card border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm opacity-50 pointer-events-none grayscale">
                            <div className="flex items-center gap-3 border-b pb-4">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-bold">الدفع (قريباً)</h2>
                            </div>
                            <p className="text-sm text-muted-foreground">حالياً الدفع يتم عند مقابلة المالك وتوقيع العقد.</p>
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                        <div className="bg-card border rounded-3xl overflow-hidden shadow-lg">
                            <div className="aspect-video w-full relative">
                                <img
                                    src={accommodation.image}
                                    alt={accommodation.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <h3 className="text-white font-bold text-lg">{accommodation.title}</h3>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">نوع السكن</span>
                                        <span className="font-medium">{accommodation.type === 'private' ? 'خاص (مستقل)' : 'مشترك'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">الموقع</span>
                                        <span className="font-medium">{accommodation.location}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">عدد الغرف</span>
                                        <span className="font-medium">{accommodation.bedrooms} غرف</span>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold">الإيجار الشهري</span>
                                        <span className="text-xl font-black text-primary">{accommodation.price} <span className="text-xs font-normal text-muted-foreground">ج.م</span></span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">شامل جميع الخدمات والمرافق</p>
                                </div>
                            </div>

                            <div className="p-4 bg-muted/30 border-t">
                                <Button
                                    type="submit"
                                    form="booking-form"
                                    className="w-full h-12 text-lg font-bold shadow-lg shadow-primary/20"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'جاري التأكيد...' : 'تأكيد الحجز'}
                                </Button>
                                <p className="text-[10px] text-center text-muted-foreground mt-3">
                                    لن يتم خصم أي مبالغ الآن. الدفع عند التعاقد.
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
                            <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                            <div className="space-y-1">
                                <h4 className="font-bold text-blue-900 text-sm">حجز آمن ومضمون</h4>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    مع يوني كونكت، بياناتك في أمان ونضمن لك تواصل موثوق مع مالك العقار المعتمد.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
