import { Shield, MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface AccommodationPricingCardProps {
    price: number;
}

export const AccommodationPricingCard = ({ price }: AccommodationPricingCardProps) => {
    return (
        <div className="bg-card rounded-3xl p-8 border shadow-lg space-y-6 sticky top-24">
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
                <Button className="w-full py-6 text-xl font-bold rounded-2xl shadow-lg shadow-primary/20 btn-hover">
                    احجز الآن
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
        </div>
    );
};
