import { Shield, MessageCircle, Info, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { BookingDialog } from "@/features/booking/components/BookingDialog";

interface AccommodationPricingCardProps {
    price: number;
    id: string;
}

export const AccommodationPricingCard = ({ price, id }: AccommodationPricingCardProps) => {
    const navigate = useNavigate();
    const [isBookingOpen, setIsBookingOpen] = useState(false);

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
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full py-6 text-xl font-bold rounded-2xl shadow-lg shadow-primary/20 btn-hover flex items-center gap-2"
                >
                    <CalendarClock className="w-6 h-6" />
                    حجز موعد للمعاينة
                </Button>
                <Button variant="outline" className="w-full py-6 text-lg font-bold rounded-2xl md:hidden">
                    <MessageCircle className="w-5 h-5 ml-2" />
                    تحدث مع المالك
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
        </div>
    );
};
