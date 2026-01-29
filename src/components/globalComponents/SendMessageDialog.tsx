import { useState } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { signalRService } from "@/features/chat/services/signalr.service";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface SendMessageDialogProps {
    recipientId: string | undefined;
    recipientName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const SendMessageDialog = ({
    recipientId,
    recipientName,
    open,
    onOpenChange
}: SendMessageDialogProps) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    const handleSendMessage = async () => {
        if (!isAuthenticated) {
            toast.error("يرجى تسجيل الدخول أولاً لإرسال رسالة");
            navigate("/login");
            return;
        }

        if (!message.trim() || !recipientId) return;

        setIsSending(true);
        try {
            await signalRService.sendMessage(recipientId, message);
            toast.success("تم إرسال الرسالة بنجاح");
            onOpenChange(false);
            setMessage("");

            // Navigate to chat and specified user
            navigate(`/chat?userId=${recipientId}`);
        } catch (error) {
            toast.error("فشل في إرسال الرسالة");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl p-6" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-primary" />
                        إرسال رسالة إلى {recipientName}
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
                        onClick={() => onOpenChange(false)}
                    >
                        إلغاء
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
