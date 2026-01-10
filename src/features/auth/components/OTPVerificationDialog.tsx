import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Clock } from "lucide-react";
import { toast } from "sonner";
import { authService } from "../services/auth.service";

interface OTPVerificationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    email: string;
    onVerified: () => void;
}

export const OTPVerificationDialog = ({
    open,
    onOpenChange,
    email,
    onVerified,
}: OTPVerificationDialogProps) => {
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

    // Timer countdown
    useEffect(() => {
        if (!open) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 0) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [open]);

    // Reset timer when dialog opens
    useEffect(() => {
        if (open) {
            setTimeLeft(600);
            setOtp("");
        }
    }, [open]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleVerify = async () => {
        if (otp.length !== 6) {
            toast.error("يرجى إدخال رمز التحقق المكون من 6 أرقام");
            return;
        }

        setIsVerifying(true);
        try {
            await authService.verifyOTP(email, otp);
            toast.success("تم التحقق من البريد الإلكتروني بنجاح");
            onVerified();
            onOpenChange(false);
        } catch (error: any) {
            toast.error(error.message || "رمز التحقق غير صحيح");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        try {
            await authService.sendOTP(email);
            toast.success("تم إرسال رمز التحقق مرة أخرى");
            setTimeLeft(600); // Reset timer
            setOtp("");
        } catch (error: any) {
            toast.error(error.message || "فشل إرسال رمز التحقق");
        } finally {
            setIsResending(false);
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Only allow digits
        if (value.length <= 6) {
            setOtp(value);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle className="flex items-center gap-2 justify-end text-2xl">
                        <Mail className="w-6 h-6 text-primary" />
                        تحقق من بريدك الإلكتروني
                    </DialogTitle>
                    <DialogDescription className="text-right text-base">
                        لقد أرسلنا رمز التحقق المكون من 6 أرقام إلى
                        <br />
                        <span className="font-bold text-foreground">{email}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Timer Display */}
                    <div className="flex items-center justify-center gap-2 p-4 bg-muted rounded-xl">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-2xl font-bold font-mono" dir="ltr">
                            {formatTime(timeLeft)}
                        </span>
                    </div>

                    {/* OTP Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-right block">
                            رمز التحقق
                        </label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            value={otp}
                            onChange={handleOtpChange}
                            placeholder="000000"
                            className="text-center text-2xl font-mono tracking-widest py-6"
                            maxLength={6}
                            dir="ltr"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Button
                            onClick={handleVerify}
                            disabled={isVerifying || otp.length !== 6}
                            className="w-full py-6 text-lg"
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    جاري التحقق...
                                </>
                            ) : (
                                "تحقق"
                            )}
                        </Button>

                        <Button
                            onClick={handleResend}
                            disabled={isResending}
                            variant="outline"
                            className="w-full py-6 text-lg"
                        >
                            {isResending ? (
                                <>
                                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                    جاري الإرسال...
                                </>
                            ) : (
                                "إعادة إرسال الرمز"
                            )}
                        </Button>
                    </div>

                    {timeLeft === 0 && (
                        <p className="text-center text-sm text-destructive">
                            انتهت صلاحية الرمز. يرجى طلب رمز جديد.
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
