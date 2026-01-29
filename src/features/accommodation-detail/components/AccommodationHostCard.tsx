import { Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfileTrigger } from "@/components/globalComponents/UserProfileTrigger";
import { formatImageUrl } from "@/lib/utils";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { SendMessageDialog } from "@/components/globalComponents/SendMessageDialog";

interface AccommodationHostCardProps {
    hostName: string;
    hostAvatar: string;
    createdById?: string;
    isAcceptedDate?: string | null;
    isAccepted?: boolean;
}

export const AccommodationHostCard = ({ hostName, hostAvatar, createdById, isAcceptedDate, isAccepted }: AccommodationHostCardProps) => {
    const { fullProfile, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const currentUserId = fullProfile?.id;
    const isOwner = currentUserId === createdById;

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenDialog = () => {
        if (!isAuthenticated) {
            toast.error("يرجى تسجيل الدخول أولاً لإرسال رسالة");
            navigate("/login");
            return;
        }
        setIsDialogOpen(true);
    };

    return (
        <div className="bg-card rounded-3xl p-5 md:p-6 border shadow-sm space-y-4">
            <h3 className="font-bold">معلومات المالك</h3>
            <UserProfileTrigger
                name={hostName}
                avatar={formatImageUrl(hostAvatar) || hostAvatar}
                userId={createdById?.toString()}
                className="w-full"
            >
                <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                    <img
                        src={formatImageUrl(hostAvatar) || hostAvatar || "https://github.com/shadcn.png"}
                        alt={hostName}
                        className="w-14 h-14 rounded-2xl object-cover"
                    />
                    <div>
                        <h4 className="font-bold text-lg">{hostName || "لا يوجد"}</h4>
                        <p className="text-sm text-muted-foreground">
                            مالك موثق منذ {isAcceptedDate ? new Date(isAcceptedDate).getFullYear() : new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </UserProfileTrigger>
            {isAccepted && (
                <div className="flex items-center gap-2 text-sm text-amber-600 font-bold bg-amber-500/10 w-fit px-3 py-1.5 rounded-full border border-amber-200/50">
                    <Shield className="w-4 h-4 fill-amber-500/20" /> حساب موثق
                </div>
            )}
            <Button
                variant="outline"
                className="w-full py-4 text-md font-bold rounded-xl hidden md:flex items-center gap-2 btn-hover"
                disabled={isOwner}
                onClick={handleOpenDialog}
            >
                <MessageCircle className="w-5 h-5" />
                {isOwner ? "أنت مالك هذا السكن" : "تحدث مع المالك"}
            </Button>

            <SendMessageDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                recipientId={createdById}
                recipientName={hostName}
            />
        </div>
    );
};
