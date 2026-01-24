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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { authService } from "../services/auth.service";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const forgetPasswordSchema = z.object({
    email: z.string().email("يرجى إدخال بريد إلكتروني صالح"),
});

type ForgetPasswordValues = z.infer<typeof forgetPasswordSchema>;

export const ForgetPasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<ForgetPasswordValues>({
        resolver: zodResolver(forgetPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: ForgetPasswordValues) {
        setIsLoading(true);
        try {
            await authService.forgetPassword(values.email);
            setIsSubmitted(true);
            toast.success("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "فشل إرسال الطلب، يرجى المحاولة مرة أخرى";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    if (isSubmitted) {
        return (
            <div className="text-center space-y-6 py-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-bold">تحقق من بريدك الإلكتروني</h3>
                    <p className="text-muted-foreground">
                        لقد أرسلنا رابطاً لإعادة تعيين كلمة المرور إلى البريد الإلكتروني الذي أدخلته.
                    </p>
                </div>
                <Button asChild className="w-full py-6 rounded-xl">
                    <Link to="/login">العودة لتسجيل الدخول</Link>
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="text-right">
                            <FormLabel>البريد الإلكتروني</FormLabel>
                            <FormControl>
                                <Input placeholder="example@gmail.com" {...field} className="text-right rounded-xl py-6" />
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
                            جاري الإرسال...
                        </>
                    ) : (
                        "إرسال رابط التعيين"
                    )}
                </Button>
                <p className="text-center text-muted-foreground mt-4">
                    تذكرت كلمة المرور؟{" "}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        سجل دخول
                    </Link>
                </p>
            </form>
        </Form>
    );
};
