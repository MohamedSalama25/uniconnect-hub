import { Shield, MessageCircle, Info, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BookingDialog } from "@/features/booking/components/BookingDialog";
import { SendMessageDialog } from "@/components/globalComponents/SendMessageDialog";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

interface AccommodationPricingCardProps {
    price: number;
    id: string;
    hostName?: string;
    hostId?: string;
    isOwner?: boolean;
}

export const AccommodationPricingCard = ({ price, id, hostName, hostId, isOwner }: AccommodationPricingCardProps) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false);

    const handleOpenMessage = () => {
        if (isOwner) return;
        if (!isAuthenticated) {
            toast.error("يرجى تسجيل الدخول أولاً لإرسال رسالة");
            navigate("/login");
            return;
        }
        setIsMessageOpen(true);
    };

    const handleOpenBooking = () => {
        if (isOwner) return;
        setIsBookingOpen(true);
    };

    return (
        <div className="bg-card rounded-3xl p-6 md:p-8 border shadow-lg space-y-6">
            <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-primary">{price}</span>
                    <span className="text-muted-foreground text-lg italic">جنيه / شهر</span>
                </div>
                <p className="text-sm text-green-600 font-bold flex items-center gap-2">
                    <Shield className="w-4 h-4" /> جميع الرسوم والخدمات مشمولة
                </p>
            </div>

            <Separator />

            <div className="space-y-4">
                <Button
                    onClick={handleOpenBooking}
                    disabled={isOwner}
                    className="w-full py-6 text-xl font-bold rounded-2xl shadow-lg shadow-primary/20 btn-hover flex items-center gap-2"
                >
                    <CalendarClock className="w-6 h-6" />
                    {isOwner ? "أنت مالك هذا السكن" : "حجز موعد للمعاينة"}
                </Button>
                <Button
                    variant="outline"
                    className="w-full py-6 text-lg font-bold rounded-2xl md:hidden"
                    disabled={isOwner}
                    onClick={handleOpenMessage}
                >
                    <MessageCircle className="w-5 h-5 ml-2" />
                    {isOwner ? "أنت مالك هذا السكن" : "تحدث مع المالك"}
                </Button>
            </div>

            <div className="p-4 bg-muted/50 rounded-2xl space-y-2">
                <p className="text-sm font-bold flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" /> سياسة الإلغاء
                </p>
                <p className="text-xs text-muted-foreground">إلغاء مجاني خلال أول 48 ساعة من الحجز.</p>
            </div>

            <BookingDialog
                open={isBookingOpen}
                onOpenChange={setIsBookingOpen}
                houseId={Number(id)}
            />

            <SendMessageDialog
                open={isMessageOpen}
                onOpenChange={setIsMessageOpen}
                recipientId={hostId}
                recipientName={hostName || "المالك"}
            />
        </div>
    );
};
