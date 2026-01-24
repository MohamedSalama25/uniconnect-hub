import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Appointment, AppointmentStatus } from "../services/appointment.service";
import { formatDate } from "@/lib/utils";
import {
    Calendar,
    Clock,
    User,
    Phone,
    MessageSquare,
    Home,
    Info,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Send,
    Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useUpdateAppointment } from "../hooks/useAppointments";
import { toast } from "sonner";

interface BookingDetailsDialogProps {
    booking: Appointment | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isOwner?: boolean;
}

const statusMap: Record<AppointmentStatus, { label: string, color: string, icon: any }> = {
    Pending: { label: "قيد المراجعة", color: "bg-amber-500/10 text-amber-600", icon: Clock },
    Accepted: { label: "تم القبول", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
    Rejected: { label: "تم الرفض", color: "bg-rose-500/10 text-rose-600", icon: XCircle },
    Cancelled: { label: "ملغي", color: "bg-gray-500/10 text-gray-600", icon: XCircle },
};

export function BookingDetailsDialog({ booking, open, onOpenChange, isOwner }: BookingDetailsDialogProps) {
    const [reply, setReply] = useState("");
    const updateMutation = useUpdateAppointment();

    useEffect(() => {
        if (booking) {
            setReply(booking.ownerResponseMessage || "");
        }
    }, [booking]);

    if (!booking) return null;

    const status = booking.status as AppointmentStatus;
    const config = statusMap[status] || statusMap.Pending;
    const StatusIcon = config.icon;

    const handleSendReply = () => {
        if (!reply.trim()) {
            toast.error("يرجى كتابة رسالة الرد أولاً");
            return;
        }

        updateMutation.mutate({
            id: booking.id,
            data: { ownerResponseMessage: reply }
        }, {
            onSuccess: () => {
                toast.success("تم إرسال الرد بنجاح");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] rounded-3xl overflow-hidden p-0 max-h-[90vh] flex flex-col" dir="rtl">
                <div className={cn("h-2 w-full shrink-0", config.color)} />
                <div className="p-6 space-y-6 overflow-y-auto">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                تفاصيل الحجز
                                <Badge className={cn("mr-2 gap-1 border-none", config.color)}>
                                    <StatusIcon className="w-3 h-3" />
                                    {config.label}
                                </Badge>
                            </DialogTitle>
                            <DialogDescription className="text-right mt-1 font-medium">
                                تم الطلب في {formatDate(booking.createdAt)}
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Appointment Info */}
                        <div className="space-y-4">
                            <h4 className="font-bold flex items-center gap-2 text-primary">
                                <Info className="w-4 h-4" />
                                معلومات الموعد
                            </h4>
                            <div className="bg-muted/30 p-4 rounded-2xl space-y-3 border shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Calendar className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-bold">{formatDate(booking.appointmentDate)}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Clock className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm font-bold">{booking.appointmentTime}</span>
                                </div>
                                <div className="flex items-center gap-3 pt-3 border-t">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Home className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">{booking.houseName}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium">{booking.houseAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className="font-bold flex items-center gap-2 text-accent">
                                <User className="w-4 h-4" />
                                معلومات التواصل
                            </h4>
                            <div className="bg-muted/30 p-4 rounded-2xl space-y-4 border shadow-sm">
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground font-bold">المستأجر</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{booking.tenantName}</span>
                                            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> {booking.tenantPhone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Separator className="bg-muted-foreground/10" />
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground font-bold">المالك</p>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{booking.ownerName}</span>
                                            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                                <Phone className="w-3 h-3" /> {booking.ownerPhone}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Style Messages */}
                    <div className="space-y-6 pt-2">
                        <div className="space-y-3">
                            <h4 className="font-bold flex items-center gap-2 text-sm text-muted-foreground">
                                <MessageSquare className="w-4 h-4" />
                                المحادثة الواردة
                            </h4>

                            {/* Tenant Message (Right aligned usually for "other") or left in Arabic context */}
                            <div className="flex flex-col gap-1 items-start max-w-[85%]">
                                <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-none text-sm font-medium shadow-sm leading-relaxed">
                                    {booking.tenantMessage || "لا توجد رسالة مرفقة من المستأجر."}
                                </div>
                                <span className="text-[10px] text-muted-foreground font-bold mr-2">رسالة المستأجر</span>
                            </div>

                            {/* Owner Response */}
                            {booking.ownerResponseMessage && (
                                <div className="flex flex-col gap-1 items-end max-w-[85%] mr-auto">
                                    <div className="bg-accent text-accent-foreground p-4 rounded-2xl rounded-tl-none text-sm font-medium shadow-sm leading-relaxed text-right">
                                        {booking.ownerResponseMessage}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-bold ml-2">رد المالك (أنت)</span>
                                </div>
                            )}
                        </div>

                        {/* Reply Area (Only for Owners who haven't replied yet) */}
                        {isOwner && !booking.ownerResponseMessage && (
                            <div className="space-y-3 pt-4 border-t border-dashed">
                                <h4 className="font-bold flex items-center gap-2 text-sm">
                                    <Send className="w-4 h-4 text-accent" />
                                    إرسال رد للمستأجر
                                </h4>
                                <div className="relative">
                                    <Textarea
                                        placeholder="اكتب ردك هنا (مثلاً: الموعد مناسب، سأتصل بك لاحقاً...)"
                                        className="rounded-2xl min-h-[100px] border-accent/20 focus-visible:ring-accent bg-accent/5 resize-none pr-4 pt-4"
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                    />
                                    <Button
                                        size="sm"
                                        className="absolute bottom-3 left-3 rounded-xl gap-2 px-5 font-bold shadow-lg"
                                        onClick={handleSendReply}
                                        disabled={updateMutation.isPending}
                                    >
                                        {updateMutation.isPending ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Send className="w-4 h-4" />
                                        )}
                                        إرسال
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="p-6 pt-0 bg-muted/20 border-t mt-auto">
                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className="w-full h-12 rounded-xl font-bold"
                    >
                        إغلاق
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
