import { Link } from "react-router-dom";
import { GraduationCap, ArrowLeft } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    className?: string;
}

export const AuthCard = ({ children, title, subtitle, className }: AuthCardProps) => {
    return (
        <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-4 relative" dir="rtl">
            <Link
                to="/welcome"
                className="absolute top-8 right-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>العودة للرئيسية</span>
            </Link>

            <div className={cn("w-full bg-background rounded-3xl shadow-xl border p-8 space-y-6", className || "max-w-xl")}>
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold italic">{title}</h1>
                    <p className="text-muted-foreground">{subtitle}</p>
                </div>

                {children}
            </div>

            <footer className="mt-8 text-muted-foreground text-sm">
                © 2026 يوني كونكت - جميع الحقوق محفوظة
            </footer>
        </div>
    );
};
