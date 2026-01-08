import { Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccommodationHostCardProps {
    hostName: string;
    hostAvatar: string;
}

export const AccommodationHostCard = ({ hostName, hostAvatar }: AccommodationHostCardProps) => {
    return (
        <div className="bg-card rounded-3xl p-6 border shadow-sm space-y-4">
            <h3 className="font-bold">معلومات المالك</h3>
            <div className="flex items-center gap-4">
                <img
                    src={hostAvatar}
                    alt={hostName}
                    className="w-14 h-14 rounded-2xl object-cover"
                />
                <div>
                    <h4 className="font-bold text-lg">{hostName}</h4>
                    <p className="text-sm text-muted-foreground">مالك موثق منذ 2024</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-accent font-bold bg-accent/10 w-fit px-3 py-1 rounded-full">
                <Shield className="w-4 h-4" /> حساب موثق
            </div>
            <Button variant="outline" className="w-full py-4 text-md font-bold rounded-xl hidden md:flex items-center gap-2 btn-hover">
                <MessageCircle className="w-5 h-5" />
                تحدث مع المالك
            </Button>
        </div>
    );
};
