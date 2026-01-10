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
import { authService } from "../services/auth.service";
import { useState } from "react";
import { Camera, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { OTPVerificationDialog } from "./OTPVerificationDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
    firstName: z.string().min(2, "الاسم الأول مطلوب"),
    lastName: z.string().min(2, "اسم العائلة مطلوب"),
    email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
    phoneNumber: z.string().min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    gender: z.string().min(1, "يرجى اختيار الجنس"),
    dateOfBirth: z.date({
        required_error: "تاريخ الميلاد مطلوب",
    }),
    birthAddress: z.string().min(5, "عنوان الميلاد مطلوب"),
    currentAddress: z.string().min(5, "العنوان الحالي مطلوب"),
    // Student only
    universityName: z.string().optional(),
    collegeName: z.string().optional(),
    academicYear: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    selectedRole: "student" | "provider";
    onBack: () => void;
}

export const RegisterForm = ({ selectedRole, onBack }: RegisterFormProps) => {
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [cardFile, setCardFile] = useState<File | null>(null);
    const [cardPreviewUrl, setCardPreviewUrl] = useState<string | null>(null);
    const [showOTPDialog, setShowOTPDialog] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");
    const [registrationData, setRegistrationData] = useState<{
        values: RegisterFormValues;
        formData: FormData;
        queryParams: Record<string, string>;
    } | null>(null);

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            gender: "",
            birthAddress: "",
            currentAddress: "",
            universityName: "",
            collegeName: "",
            academicYear: "",
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleCardFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCardFile(file);
            const url = URL.createObjectURL(file);
            setCardPreviewUrl(url);
        }
    };

    async function onSubmit(values: RegisterFormValues) {
        if (!profilePicture) {
            toast.error("يرجى اختيار صورة شخصية");
            return;
        }

        if (!cardFile) {
            toast.error(selectedRole === "student" ? "يرجى رفع صورة الكارنيه الجامعي" : "يرجى رفع صورة البطاقة الشخصية");
            return;
        }

        setIsLoading(true);
        try {
            // Step 1: Send OTP to email
            await authService.sendOTP(values.email);
            toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");

            // Step 2: Prepare registration data
            const formData = new FormData();
            formData.append("ProfilePicture", profilePicture);

            const queryParams: Record<string, string> = {
                Email: values.email,
                Phonenumber: values.phoneNumber,
                Password: values.password,
                FirstName: values.firstName,
                LastName: values.lastName,
                Gender: values.gender,
                DateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
                BirthAddress: values.birthAddress,
                CurrentAddress: values.currentAddress,
            };

            if (selectedRole === "student") {
                queryParams.UniversityName = values.universityName || "";
                queryParams.CollegeName = values.collegeName || "";
                queryParams.AcademicYear = values.academicYear || "1";
            }

            // Step 3: Store data and show OTP dialog
            setRegistrationData({ values, formData, queryParams });
            setOtpEmail(values.email);
            setShowOTPDialog(true);
        } catch (error: any) {
            toast.error(error.message || "فشل إرسال رمز التحقق");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleOTPVerified() {
        if (!registrationData) return;

        setIsLoading(true);
        try {
            if (selectedRole === "student") {
                await authService.registerAsStudent(
                    registrationData.formData,
                    registrationData.queryParams,
                    cardFile!
                );
            } else {
                await authService.registerAsService(
                    registrationData.formData,
                    registrationData.queryParams,
                    cardFile!
                );
            }

            toast.success("تم إنشاء الحساب بنجاح");
            navigate("/login");
        } catch (error: any) {
            toast.error(error.message || "حدث خطأ أثناء التسجيل");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center justify-center space-y-4 mb-8">
                    <div className="relative group">
                        <Avatar className="w-32 h-32 border-4 border-primary/10 shadow-xl overflow-hidden">
                            <AvatarImage src={previewUrl || ""} className="object-cover" />
                            <AvatarFallback className="bg-muted text-4xl">
                                <Camera className="w-12 h-12 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <label
                            htmlFor="profile-upload"
                            className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full"
                        >
                            <Camera className="text-white w-8 h-8" />
                        </label>
                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                    <p className="text-sm text-muted-foreground">صورة الملف الشخصي (مطلوبة)</p>
                </div>

                {/* Card ID Upload */}
                <div className="bg-muted/30 p-6 rounded-2xl border-2 border-dashed border-primary/20 space-y-4">
                    <div className="flex items-center justify-between" dir="rtl">
                        <div className="space-y-1 text-right">
                            <h4 className="font-bold text-lg">
                                {selectedRole === "student" ? "الكارنيه الجامعي" : "البطاقة الشخصية"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                {selectedRole === "student"
                                    ? "يرجى رفع صورة واضحة للكارنيه الجامعي الخاص بك"
                                    : "يرجى رفع صورة واضحة للبطاقة الشخصية (وجه وظهر إن أمكن)"}
                            </p>
                        </div>
                        <div className="relative group">
                            <div className="w-24 h-16 bg-background rounded-lg border flex items-center justify-center overflow-hidden shadow-sm">
                                {cardPreviewUrl ? (
                                    <img src={cardPreviewUrl} alt="Card Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="w-6 h-6 text-muted-foreground" />
                                )}
                            </div>
                            <label
                                htmlFor="card-upload"
                                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
                            >
                                <Camera className="text-white w-5 h-5" />
                            </label>
                            <input
                                id="card-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCardFileChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem className="text-right">
                                <FormLabel>الاسم الأول</FormLabel>
                                <FormControl>
                                    <Input placeholder="أدخل اسمك الأول" {...field} className="text-right rounded-xl py-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem className="text-right">
                                <FormLabel>اسم العائلة</FormLabel>
                                <FormControl>
                                    <Input placeholder="أدخل اسم العائلة" {...field} className="text-right rounded-xl py-6" />
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
                                    <Input placeholder="example@uni.com" {...field} className="text-right rounded-xl py-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem className="text-right">
                                <FormLabel>رقم الهاتف</FormLabel>
                                <FormControl>
                                    <Input placeholder="05xxxxxxxx" {...field} className="text-right rounded-xl py-6" />
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
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="text-right">
                                <FormLabel>الجنس</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="text-right rounded-xl py-6">
                                            <SelectValue placeholder="اختر الجنس" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Male" dir="rtl">ذكر</SelectItem>
                                        <SelectItem value="Female" dir="rtl">أنثى</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Birth Date Picker */}
                    <FormField
                        control={form.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                            <FormItem className="text-right flex flex-col">
                                <FormLabel className="mb-2">تاريخ الميلاد</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full text-right font-normal rounded-xl py-6",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "yyyy/MM/dd")
                                                ) : (
                                                    <span>اختر التاريخ</span>
                                                )}
                                                <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="birthAddress"
                        render={({ field }) => (
                            <FormItem className="text-right">
                                <FormLabel>مكان الميلاد</FormLabel>
                                <FormControl>
                                    <Input placeholder="مثال: الرياض" {...field} className="text-right rounded-xl py-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="currentAddress"
                        render={({ field }) => (
                            <FormItem className="text-right">
                                <FormLabel>العنوان الحالي</FormLabel>
                                <FormControl>
                                    <Input placeholder="مثال: حي الملك فهد" {...field} className="text-right rounded-xl py-6" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {selectedRole === "student" && (
                        <>
                            <FormField
                                control={form.control}
                                name="universityName"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel>اسم الجامعة</FormLabel>
                                        <FormControl>
                                            <Input placeholder="جامعة الملك سعود" {...field} className="text-right rounded-xl py-6" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="collegeName"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel>الكلية</FormLabel>
                                        <FormControl>
                                            <Input placeholder="كلية الهندسة" {...field} className="text-right rounded-xl py-6" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="academicYear"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel>السنة الدراسية</FormLabel>
                                        <FormControl>
                                            <Input placeholder="مثال: 3" type="number" {...field} className="text-right rounded-xl py-6" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </div>

                <div className="flex gap-4 mt-8">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="flex-1 py-6 text-lg rounded-xl"
                        disabled={isLoading}
                    >
                        رجوع
                    </Button>
                    <Button
                        type="submit"
                        className="flex-[2] py-6 text-lg rounded-xl"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                                جاري التسجيل...
                            </>
                        ) : (
                            "إنشاء الحساب"
                        )}
                    </Button>
                </div>
                <p className="text-center text-muted-foreground mt-4">
                    لديك حساب بالفعل؟{" "}
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        سجل دخولك
                    </Link>
                </p>
            </form>

            {/* OTP Verification Dialog */}
            <OTPVerificationDialog
                open={showOTPDialog}
                onOpenChange={setShowOTPDialog}
                email={otpEmail}
                onVerified={handleOTPVerified}
            />
        </Form>
    );
};
