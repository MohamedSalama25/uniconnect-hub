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
    university: z.string().min(2, "يرجى إدخال اسم الجامعة").optional(),
    major: z.string().min(2, "يرجى إدخال التخصص").optional(),
    serviceType: z.string().min(2, "يرجى إدخال نوع الخدمة").optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    selectedRole: "student" | "provider";
    onBack: () => void;
}

export const RegisterForm = ({ selectedRole, onBack }: RegisterFormProps) => {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            university: "",
            major: "",
            serviceType: "",
        },
    });

    function onSubmit(values: RegisterFormValues) {
        login({
            id: Math.random().toString(36).substr(2, 9),
            name: values.name,
            email: values.email,
            role: selectedRole === "student" ? "student" : "admin", // Assuming provider maps to admin for now or update store
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

                {selectedRole === "student" ? (
                    <>
                        <FormField
                            control={form.control}
                            name="university"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>الجامعة</FormLabel>
                                    <FormControl>
                                        <Input placeholder="اسم الجامعة" {...field} className="text-right" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="major"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>التخصص</FormLabel>
                                    <FormControl>
                                        <Input placeholder="تخصصك الدراسي" {...field} className="text-right" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                ) : (
                    <FormField
                        control={form.control}
                        name="serviceType"
                        render={({ field }) => (
                            <FormItem className="text-right">
                                <FormLabel>نوع الخدمة</FormLabel>
                                <FormControl>
                                    <Input placeholder="مثال: سكن، مواصلات، نقل" {...field} className="text-right" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

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
                <div className="flex gap-4 mt-6">
                    <Button type="button" variant="outline" onClick={onBack} className="flex-1 py-6 text-lg rounded-xl">
                        رجوع
                    </Button>
                    <Button type="submit" className="flex-[2] py-6 text-lg rounded-xl">
                        تسجيل
                    </Button>
                </div>
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
