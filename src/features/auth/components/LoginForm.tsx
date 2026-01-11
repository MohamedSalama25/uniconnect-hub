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
import { PasswordInput } from "@/components/ui/password-input";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { authService } from "../services/auth.service";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
    emailORUsername: z.string().min(3, "يرجى إدخال البريد الإلكتروني أو اسم المستخدم"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            emailORUsername: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginFormValues) {
        navigate("/");
        // setIsLoading(true);
        // try {
        //     const data = await authService.login({
        //         emailORUsername: values.emailORUsername,
        //         password: values.password
        //     });

        //     // Store initial login data (including token)
        //     login({
        //         email: data.email,
        //         displayName: data.displayName,
        //         token: data.token,
        //         roles: data.roles
        //     });

        //     // Fetch full profile immediately
        //     try {
        //         const fullProfile = await authService.getCurrentUser(data.token);
        //         useAuthStore.getState().setUserDetails(fullProfile);
        //     } catch (profileError) {
        //         console.error("Failed to fetch full profile:", profileError);
        //         // We still proceed since the login itself was successful
        //     }

        //     toast.success("تم تسجيل الدخول بنجاح");
        //     navigate("/");
        // } catch (error: any) {
        //     toast.error(error.message || "فشل تسجيل الدخول، يرجى التأكد من البيانات");
        // } finally {
        //     setIsLoading(false);
        // }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="emailORUsername"
                    render={({ field }) => (
                        <FormItem className="text-right">
                            <FormLabel>البريد الإلكتروني / اسم المستخدم</FormLabel>
                            <FormControl>
                                <Input placeholder="أدخل بياناتك" {...field} className="text-right rounded-xl py-6" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem className="text-right">
                            <FormLabel>كلمة المرور</FormLabel>
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
                            جاري الدخول...
                        </>
                    ) : (
                        "دخول"
                    )}
                </Button>
                <p className="text-center text-muted-foreground mt-4">
                    ليس لديك حساب؟{" "}
                    <Link to="/register" className="text-primary font-bold hover:underline">
                        سجل الآن
                    </Link>
                </p>
            </form>
        </Form>
    );
};
