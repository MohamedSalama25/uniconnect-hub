import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpRequest } from "../types/help-request.types";
import { formatDate } from "@/lib/utils";
import { MessageCircle, Clock, User, Send, X, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HelpRequestDetailsDialogProps {
    request: HelpRequest | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function HelpRequestDetailsDialog({
    request,
    open,
    onOpenChange,
}: HelpRequestDetailsDialogProps) {
    const navigate = useNavigate();

    if (!request) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent dir="rtl" className="max-w-2xl rounded-[2.5rem] bg-card border-border p-0 overflow-hidden shadow-2xl">
                <div className="relative p-8 space-y-8">
                    {/* Hero Gradient Background */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                    <DialogHeader className="relative z-10 flex flex-row items-center justify-between text-right">
                        <div className="space-y-4 flex-1">
                            <Badge className="bg-primary/20 text-primary border-none px-4 py-1.5 rounded-xl font-black text-xs uppercase tracking-wider">
                                {request.helpRequestTypeName || "طلب مساعدة"}
                            </Badge>
                            <DialogTitle className="text-3xl font-black tracking-tight leading-tight">
                                {request.title}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground font-bold border-b border-border/50 pb-6 relative z-10">
                        <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-xl">
                            <User className="w-4 h-4 text-primary" />
                            <span>{request.createdUser?.username || "غير معروف"}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-xl">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{formatDate(request.createdAt)}</span>
                        </div>
                        {request.createdUser?.universityName && (
                            <div className="flex items-center gap-2 bg-muted/30 px-4 py-2 rounded-xl">
                                <Info className="w-4 h-4 text-primary" />
                                <span>{request.createdUser.universityName}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 relative z-10">
                        <h4 className="text-xl font-black flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-primary" />
                            التفاصيل والمحتوى
                        </h4>
                        <p className="text-lg leading-relaxed text-muted-foreground font-medium whitespace-pre-wrap bg-muted/30 p-6 rounded-3xl border border-border/50">
                            {request.description}
                        </p>
                    </div>

                    <div className="pt-6 relative z-10">
                        <Button
                            onClick={() => navigate('/chat')}
                            className="w-full h-16 rounded-2xl text-xl font-black bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                        >
                            <Send className="w-6 h-6 ml-3" />
                            تواصل خاص
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
