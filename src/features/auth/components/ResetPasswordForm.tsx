import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { useState, useEffect } from "react";
import { authService } from "../services/auth.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, KeyRound } from "lucide-react";

const resetPasswordSchema = z.object({
    newPassword: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    useEffect(() => {
        if (!token || !email) {
            toast.error("رابط غير صالح، يرجى طلب رابط جديد");
            navigate("/forget-password");
        }
    }, [token, email, navigate]);

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            newPassword: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: ResetPasswordValues) {
        if (!token || !email) return;

        setIsLoading(true);
        try {
            await authService.resetPassword({
                emailORUsername: email,
                token: token,
                newPassword: values.newPassword
            });
            toast.success("تم تغيير كلمة المرور بنجاح");
            navigate("/login");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "فشل تغيير كلمة المرور، يرجى المحاولة مرة أخرى";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-xl flex items-center gap-3 mb-6">
                    <KeyRound className="w-5 h-5 text-primary" />
                    <div className="text-right">
                        <p className="text-sm font-medium">إعادة تعيين كلمة المرور لـ:</p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem className="text-right">
                            <FormLabel>كلمة المرور الجديدة</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="••••••••" {...field} className="text-right rounded-xl py-6" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem className="text-right">
                            <FormLabel>تأكيد كلمة المرور الجديدة</FormLabel>
                            <FormControl>
                                <PasswordInput placeholder="••••••••" {...field} className="text-right rounded-xl py-6" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    className="w-full py-6 text-lg rounded-xl mt-4"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                            جاري التغيير...
                        </>
                    ) : (
                        "تغيير كلمة المرور"
                    )}
                </Button>
            </form>
        </Form>
    );
};
