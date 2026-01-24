import { Shield, MessageCircle, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfileTrigger } from "@/components/globalComponents/UserProfileTrigger";
import { formatImageUrl } from "@/lib/utils";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { signalRService } from "@/features/chat/services/signalr.service";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";

interface AccommodationHostCardProps {
    hostName: string;
    hostAvatar: string;
    createdById?: string;
}

export const AccommodationHostCard = ({ hostName, hostAvatar, createdById }: AccommodationHostCardProps) => {
    const { fullProfile } = useAuthStore();
    const navigate = useNavigate();
    const currentUserId = fullProfile?.id;
    const isOwner = currentUserId === createdById;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        if (!message.trim() || !createdById) return;

        setIsSending(true);
        try {
            await signalRService.sendMessage(createdById, message);
            toast.success("تم إرسال الرسالة بنجاح");
            setIsDialogOpen(false);
            setMessage("");
            // Optional: navigate to chat
            // navigate("/chat");
        } catch (error) {
            toast.error("فشل في إرسال الرسالة");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="bg-card rounded-3xl p-5 md:p-6 border shadow-sm space-y-4">
            <h3 className="font-bold">معلومات المالك</h3>
            <UserProfileTrigger name={hostName} avatar={formatImageUrl(hostAvatar) || hostAvatar} className="w-full">
                <div className="flex items-center gap-4 p-2 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                    <img
                        src={formatImageUrl(hostAvatar) || hostAvatar}
                        alt={hostName}
                        className="w-14 h-14 rounded-2xl object-cover"
                    />
                    <div>
                        <h4 className="font-bold text-lg">{hostName}</h4>
                        <p className="text-sm text-muted-foreground">مالك موثق منذ 2024</p>
                    </div>
                </div>
            </UserProfileTrigger>
            <div className="flex items-center gap-2 text-sm text-accent font-bold bg-accent/10 w-fit px-3 py-1 rounded-full">
                <Shield className="w-4 h-4" /> حساب موثق
            </div>
            <Button
                variant="outline"
                className="w-full py-4 text-md font-bold rounded-xl hidden md:flex items-center gap-2 btn-hover"
                disabled={isOwner}
                onClick={() => setIsDialogOpen(true)}
            >
                <MessageCircle className="w-5 h-5" />
                {isOwner ? "أنت مالك هذا السكن" : "تحدث مع المالك"}
            </Button>

            {/* Message Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-6" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <MessageCircle className="w-6 h-6 text-primary" />
                            إرسال رسالة إلى {hostName}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Textarea
                            placeholder="اكتب رسالتك هنا..."
                            className="min-h-[150px] rounded-2xl p-4 resize-none border-2 focus-visible:ring-primary focus-visible:border-primary transition-all"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                    <DialogFooter className="flex flex-row-reverse gap-3 sm:justify-start">
                        <Button
                            className="flex-1 rounded-xl h-12 font-bold gap-2"
                            onClick={handleSendMessage}
                            disabled={!message.trim() || isSending}
                        >
                            {isSending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            إرسال الرسالة
                        </Button>
                        <Button
                            variant="ghost"
                            className="flex-1 rounded-xl h-12 font-bold"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            إلغاء
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
