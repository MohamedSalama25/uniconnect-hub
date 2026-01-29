import React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    User, Mail, Phone, MapPin, School, GraduationCap,
    Calendar, Shield, Info, CheckCircle2, AlertCircle
} from "lucide-react";
import { UserDto } from "../types";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface AdminUserDetailModalProps {
    user: UserDto | null;
    isOpen: boolean;
    onClose: () => void;
}

export function AdminUserDetailModal({ user, isOpen, onClose }: AdminUserDetailModalProps) {
    if (!user) return null;

    const dataSection = (icon: any, label: string, value: string | number | React.ReactNode) => (
        <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-transparent hover:border-primary/20 transition-all">
            <div className="p-2 rounded-lg bg-background shadow-sm text-primary">
                {React.createElement(icon, { className: "w-4 h-4" })}
            </div>
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground font-medium mb-0.5">{label}</span>
                <span className="text-sm font-bold text-foreground">{value || "—"}</span>
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl" dir="rtl">
                <DialogHeader className="sr-only">
                    <DialogTitle>تفاصيل المستخدم - {user.username}</DialogTitle>
                </DialogHeader>

                {/* Banner & Avatar */}
                <div className="relative h-32 bg-gradient-to-r from-primary/80 to-primary/40">
                    <div className="absolute -bottom-12 right-6">
                        <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                            <AvatarImage src={user.profilePictureUrl} alt={user.username} className="object-cover" />
                            <AvatarFallback className="text-2xl bg-primary text-white">
                                {user.firstName?.[0] || user.username?.[0]}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                <div className="pt-14 px-6 pb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold tracking-tight">
                                    {user.firstName} {user.lastName}
                                </h2>
                                {user.isAccepted && (
                                    <Badge className="bg-green-500/10 text-green-600 border-none px-2 py-0.5 hover:bg-green-500/20">
                                        <CheckCircle2 className="w-3 h-3 ml-1" /> موثق
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground font-medium flex items-center gap-1.5">
                                @{user.username}
                                <span className="h-1 w-1 rounded-full bg-muted-foreground/30 mx-1" />
                                {user.email}
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <div className="flex flex-wrap gap-1 justify-end">
                                {user.roles.map(role => (
                                    <Badge key={role} variant="secondary" className="font-bold py-1">
                                        {role === 'Admin' ? 'مشرف' : role === 'Student' ? 'طالب' : role === 'Service' ? 'مقدم خدمة' : role}
                                    </Badge>
                                ))}
                            </div>
                            {user.isBlocked && (
                                <Badge variant="destructive" className="font-bold">محظور</Badge>
                            )}
                        </div>
                    </div>

                    <ScrollArea className="h-[450px] pr-1">
                        <div className={cn(
                            "grid gap-6 pb-4",
                            user.roles.includes('Student') ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                        )}>
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-primary flex items-center gap-2 px-2">
                                    <User className="w-4 h-4" /> المعلومات الشخصية
                                </h3>
                                <div className={cn(
                                    "grid gap-4",
                                    !user.roles.includes('Student') && "grid-cols-1 md:grid-cols-2"
                                )}>
                                    {dataSection(User, "الجنس", user.gender === 'Male' ? 'ذكر' : 'أنثى')}
                                    {dataSection(Calendar, "تاريخ الميلاد",
                                        user.dateOfBirth ? format(new Date(user.dateOfBirth), "PPP", { locale: ar }) : "—"
                                    )}
                                    {dataSection(Phone, "رقم الهاتف", user.phoneNumber || user.phonenumber)}
                                    {dataSection(MapPin, "عنوان السكن الحالي", user.currentAddress)}
                                    {dataSection(MapPin, "مكان الميلاد", user.birthAddress)}
                                </div>
                            </div>

                            {user.roles.includes('Student') ? (
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-primary flex items-center gap-2 px-2">
                                        <School className="w-4 h-4" /> المعلومات الأكاديمية
                                    </h3>
                                    {dataSection(School, "الجامعة", user.universityName)}
                                    {dataSection(GraduationCap, "الكلية", user.collegeName)}
                                    {dataSection(Calendar, "السنة الدراسية", user.academicYear)}
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                                        <p className="text-xs text-primary font-bold mb-2 flex items-center gap-1">
                                            <Info className="w-3 h-3" /> ملاحظة تعريفية
                                        </p>
                                        <p className="text-sm leading-relaxed text-muted-foreground italic">
                                            "{user.introductionNote || "لا توجد ملاحظة"}"
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 mt-2">
                                    <h3 className="text-sm font-bold text-primary flex items-center gap-2 px-2">
                                        <Info className="w-4 h-4" /> ملاحظة تعريفية
                                    </h3>
                                    <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 border-dashed">
                                        <p className="text-base leading-relaxed text-muted-foreground italic text-center">
                                            "{user.introductionNote || "لا توجد ملاحظة تعريفية مضافة لهذا المستخدم."}"
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {user.isAcceptedDate && (
                            <div className="mt-4 p-4 rounded-xl bg-green-500/5 text-green-600 text-xs flex items-center justify-center gap-2 border border-green-500/10">
                                <CheckCircle2 className="w-4 h-4" />
                                تم قبول هذا المستخدم في {format(new Date(user.isAcceptedDate), "PPP", { locale: ar })}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
