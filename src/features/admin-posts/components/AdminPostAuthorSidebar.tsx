import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, UserCheck, Shield, MessageCircle, Send, Loader2, Ban, ShieldAlert } from "lucide-react";
import { UserProfileTrigger } from "@/components/globalComponents/UserProfileTrigger";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { signalRService } from "@/features/chat/services/signalr.service";
import { useAdminUserMutations } from "@/features/admin-users/hooks/useAdminUserMutations";
import { formatDateArabic } from "@/lib/utils";
import { PostDetails } from "../types";
import { cn } from "@/lib/utils";

interface AdminPostAuthorSidebarProps {
    post: PostDetails;
    user: any; // User object from API
}

const AdminPostAuthorSidebar: React.FC<AdminPostAuthorSidebarProps> = ({ post, user }) => {
    const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const { blockUser, isPending: isMutationPending } = useAdminUserMutations();

    const displayName = user ? `${user.firstName} ${user.lastName}`.trim() || user.username : post.author;
    const avatarSeed = user?.username || post.author;
    const phone = user?.phonenumber || post.phone;
    const email = user?.email || post.email;
    const university = user?.universityName || post.university;
    const joinDate = user?.isAcceptedDate || "2024-09-01T00:00:00";
    const isBlocked = user?.isBlocked;

    const handleSendMessage = async () => {
        if (!message.trim() || !user?.id) return;
        setIsSending(true);
        try {
            await signalRService.sendMessage(user.id, message);
            toast.success("تم إرسال الرسالة بنجاح");
            setIsMessageDialogOpen(false);
            setMessage("");
        } catch (error) {
            toast.error("فشل في إرسال الرسالة");
        } finally {
            setIsSending(false);
        }
    };

    const handleToggleBlock = () => {
        if (!user?.id) return;
        setIsConfirmOpen(true);
    };

    const confirmToggleBlock = () => {
        if (!user?.id) return;
        blockUser({ userId: user.id, isBlocked: !isBlocked });
        setIsConfirmOpen(false);
    };

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden sticky top-8 bg-emerald-500/5">
                <div className="h-24 bg-gradient-to-r from-emerald-500 to-emerald-800/20" />
                <CardContent className="p-8 -mt-12">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="relative">
                            <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
                                <AvatarImage src={user?.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} />
                                <AvatarFallback>{displayName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 bg-green-500 border-2 border-background w-6 h-6 rounded-full flex items-center justify-center">
                                <UserCheck className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{displayName}</h3>
                            <p className="text-sm text-muted-foreground">{university}</p>
                        </div>
                        <div className="w-full pt-4 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    className="rounded-xl gap-2 font-bold border-primary/20 hover:bg-primary/5 flex-1"
                                    onClick={() => setIsMessageDialogOpen(true)}
                                >
                                    <MessageCircle className="w-4 h-4" /> مراسلة
                                </Button>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "rounded-xl gap-2 font-bold flex-1",
                                        isBlocked
                                            ? "border-green-500/20 text-green-600 hover:bg-green-500/5"
                                            : "border-red-500/20 text-red-600 hover:bg-red-500/5"
                                    )}
                                    onClick={handleToggleBlock}
                                    disabled={isMutationPending}
                                >
                                    {isMutationPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        isBlocked ? <ShieldAlert className="w-4 h-4" /> : <Ban className="w-4 h-4" />
                                    )}
                                    {isBlocked ? "فك الحظر" : "حظر"}
                                </Button>
                            </div>

                            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl transition-colors hover:bg-muted">
                                <Phone className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium" dir="ltr">{phone}</span>
                            </div>
                            <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl transition-colors hover:bg-muted">
                                <Mail className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{email}</span>
                            </div>
                            <UserProfileTrigger
                                userId={user?.id || post.authorId}
                                name={displayName}
                                avatar={user?.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                                className="w-full"
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full rounded-xl gap-2 font-bold hover:bg-primary/5"
                                >
                                    <User className="w-4 h-4" /> فحص الملف الشخصي
                                </Button>
                            </UserProfileTrigger>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-6 flex flex-col gap-4 border-t">
                    <div className="flex justify-between w-full text-sm">
                        <span className="text-muted-foreground">تاريخ الانضمام</span>
                        <span className="font-bold">{formatDateArabic(joinDate)}</span>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                        <span className="text-muted-foreground">إجمالي المنشورات</span>
                        <span className="font-bold text-primary">12 منشور</span>
                    </div>
                    <div className="flex justify-between w-full text-sm">
                        <span className="text-muted-foreground">الحساب موثق</span>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-none">نعم</Badge>
                    </div>
                </CardFooter>
            </Card>

            {/* Message Dialog */}
            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-6" dir="rtl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            <MessageCircle className="w-6 h-6 text-primary" />
                            إرسال رسالة إلى {displayName}
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
                            onClick={() => setIsMessageDialogOpen(false)}
                        >
                            إلغاء
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmToggleBlock}
                title={isBlocked ? "تأكيد فك الحظر" : "تأكيد حظر المستخدم"}
                description={
                    isBlocked
                        ? `هل أنت متأكد من رغبتك في فك الحظر عن ${displayName}؟ سيتمكن المستخدم من النشر والتفاعل مرة أخرى.`
                        : `هل أنت متأكد من رغبتك في حظر ${displayName}؟ لن يتمكن المستخدم من الوصول إلى حسابه أو القيام بأي نشاط.`
                }
                confirmText={isBlocked ? "فك الحظر" : "حظر المستخدم"}
                variant={isBlocked ? "default" : "destructive"}
            />
        </div>
    );
};

export default AdminPostAuthorSidebar;
