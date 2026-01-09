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

const loginSchema = z.object({
    email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    function onSubmit(values: LoginFormValues) {
        login({
            id: "1",
            name: "uniConect",
            email: values.email,
            role: "student",
        });
        toast.success("تم تسجيل الدخول بنجاح");
        navigate("/");
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
                                <Input placeholder="example@uni.com" {...field} className="text-right" />
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
                                <PasswordInput placeholder="••••••••" {...field} className="text-right" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full py-6 text-lg rounded-xl mt-4">
                    دخول
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
