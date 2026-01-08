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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const registerSchema = z.object({
    name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    role: z.enum(["student", "admin"], {
        required_error: "يرجى اختيار نوع الحساب",
    }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            role: "student",
        },
    });

    function onSubmit(values: RegisterFormValues) {
        login({
            id: Math.random().toString(36).substr(2, 9),
            name: values.name,
            email: values.email,
            role: values.role as 'student' | 'admin',
        });
        toast.success("تم إنشاء الحساب بنجاح");
        navigate("/");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="text-right">
                            <FormLabel>الاسم الكامل</FormLabel>
                            <FormControl>
                                <Input placeholder="أدخل اسمك" {...field} className="text-right" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
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
                    name="role"
                    render={({ field }) => (
                        <FormItem className="text-right">
                            <FormLabel>نوع الحساب</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger dir="rtl">
                                        <SelectValue placeholder="اختر نوع الحساب" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="student">طالب</SelectItem>
                                    <SelectItem value="admin">مسؤول</SelectItem>
                                </SelectContent>
                            </Select>
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
                                <Input type="password" placeholder="••••••••" {...field} className="text-right" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full py-6 text-lg rounded-xl mt-4">
                    تسجيل
                </Button>
                <p className="text-center text-muted-foreground mt-4">
                    لديك حساب بالفعل؟{" "}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        سجل دخولك
                    </Link>
                </p>
            </form>
        </Form>
    );
};
