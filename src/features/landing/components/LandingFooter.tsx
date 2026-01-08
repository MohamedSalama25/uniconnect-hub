import { Link } from "react-router-dom";
import { GraduationCap, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

const SocialLink = ({ icon }: { icon: React.ReactNode }) => (
    <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all hover:-translate-y-1">
        {icon}
    </a>
);

interface LandingFooterProps {
    footerRef: React.RefObject<HTMLElement>;
    isVisible: boolean;
}

export const LandingFooter = ({ footerRef, isVisible }: LandingFooterProps) => {
    return (
        <footer ref={footerRef} className="py-20 border-t mt-auto bg-card overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-12 gap-12 mb-16 text-right">
                    <div dir="ltr" className={cn("md:col-span-5 space-y-6", isVisible ? "animate-slide-right" : "opacity-0 translate-x-[-20px]")}>
                        <div className="flex items-center gap-2 justify-end">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                                <GraduationCap className="text-white w-6 h-6" />
                            </div>
                            <span className="text-2xl font-bold">يوني كونكت</span>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-md ml-auto">
                            المنصة المتكاملة الأولى لخدمة الطلاب الجامعيين في مصر . نسعى لتوفير كل سبل الراحة والخدمات المتميزة بجودة عالية.
                        </p>
                        <div className="flex items-center gap-4 justify-end pt-4">
                            <SocialLink icon={<Facebook className="w-5 h-5" />} />
                            <SocialLink icon={<Twitter className="w-5 h-5" />} />
                            <SocialLink icon={<Instagram className="w-5 h-5" />} />
                            <SocialLink icon={<Linkedin className="w-5 h-5" />} />
                        </div>
                    </div>

                    <div className={cn("md:col-span-2 space-y-4", isVisible ? "animate-slide-up animate-delay-100" : "opacity-0 translate-y-4")}>
                        <h3 className="font-bold text-xl mb-4">روابط سريعة</h3>
                        <ul className="space-y-3 text-muted-foreground text-lg">
                            <li><Link to="/welcome" className="hover:text-primary transition-colors">الرئيسية</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors">السكن</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors">الخدمات</Link></li>
                            <li><Link to="/login" className="hover:text-primary transition-colors">تواصل معنا</Link></li>
                        </ul>
                    </div>

                    <div className={cn("md:col-span-2 space-y-4", isVisible ? "animate-slide-up animate-delay-200" : "opacity-0 translate-y-4")}>
                        <h3 className="font-bold text-xl mb-4">قانوني</h3>
                        <ul className="space-y-3 text-muted-foreground text-lg">
                            <li><Link to="#" className="hover:text-primary transition-colors">سياسة الخصوصية</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">شروط الاستخدام</Link></li>
                            <li><Link to="#" className="hover:text-primary transition-colors">اتفاقية الاشتراك</Link></li>
                        </ul>
                    </div>

                    <div className={cn("md:col-span-3 space-y-4", isVisible ? "animate-slide-left" : "opacity-0 translate-x-[20px]")}>
                        <h3 className="font-bold text-xl mb-4">النشرة الإخبارية</h3>
                        <p className="text-muted-foreground">اشترك ليصلك كل جديد عن السكن والخدمات.</p>
                        <div className="flex gap-2">
                            <Button size="sm" className="btn-hover">اشترك</Button>
                            <input
                                type="email"
                                placeholder="بريدك الإلكتروني"
                                className="bg-muted px-3 py-2 rounded-lg flex-1 text-right focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className={cn("border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground", isVisible ? "animate-fade-in animate-delay-300" : "opacity-0")}>
                    <p>© 2026 يوني كونكت. جميع الحقوق محفوظة لـ <span className="text-foreground font-bold">uniConect</span>.</p>
                    <div className="flex gap-6">
                        <span className="hover:text-primary cursor-pointer transition-colors hover:underline">English</span>
                        <span className="hover:text-primary cursor-pointer transition-colors hover:underline">العربية</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
