import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Upload, X, Loader2, MapPin, Phone, Clock, Briefcase } from "lucide-react";
import { LocationPicker } from "@/components/globalComponents/LocationPicker";

const formSchema = z.object({
    name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    category: z.enum(["restaurant", "pharmacy", "hospital", "laundry", "transportation"], {
        required_error: "يرجى اختيار القسم",
    }),
    description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
    phone: z.string().min(10, "رقم الهاتف غير صحيح"),
    address: z.string().min(5, "يرجى إدخال العنوان بالتفصيل"),
    hours: z.string().min(3, "يرجى إدخال مواعيد العمل"),
    location: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional(),
});

interface AddServiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddServiceModal({ open, onOpenChange }: AddServiceModalProps) {
    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            phone: "",
            address: "",
            hours: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (images.length === 0) {
            toast.error("يرجى إضافة صورة واحدة على الأقل");
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log({ ...values, images });
        toast.success("تم إضافة الخدمة بنجاح!", {
            description: "سيتم مراجعة طلبك من قبل المشرفين قبل النشر."
        });

        setIsSubmitting(false);
        onOpenChange(false);
        form.reset();
        setImages([]);
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => URL.createObjectURL(file));
            setImages([...images, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-right">إضافة خدمة جديدة</DialogTitle>
                    <DialogDescription className="text-right text-base">
                        شارك خدماتك مع الطلاب الآخرين. يرجى تعبئة جميع المعلومات بدقة.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel>اسم الخدمة / الشركة <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="مثال: مطعم النور للحنيذ" {...field} className="h-12 text-right text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel>القسم <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 text-base" dir="rtl">
                                                    <SelectValue placeholder="اختر القسم" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="restaurant">مطاعم</SelectItem>
                                                <SelectItem value="pharmacy">صيدليات</SelectItem>
                                                <SelectItem value="hospital">مستشفيات</SelectItem>
                                                <SelectItem value="laundry">مغاسل</SelectItem>
                                                <SelectItem value="transportation">مواصلات</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 flex items-center gap-2 text-purple-700 font-bold border-b border-purple-200 pb-2 mb-2">
                                <Briefcase className="w-5 h-5" />
                                تفاصيل الخدمة
                            </div>

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel>رقم التواصل</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input placeholder="01xxxxxxxxx" className="h-12 bg-white pr-10 dir-ltr" style={{ direction: 'ltr', textAlign: 'right' }} {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hours"
                                render={({ field }) => (
                                    <FormItem className="text-right">
                                        <FormLabel>مواعيد العمل</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input placeholder="مثال: 8:00 ص - 10:00 م" className="h-12 bg-white pr-10" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2 text-right">
                                        <FormLabel>العنوان بالتفصيل</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input placeholder="المكان بالتحديد..." className="h-12 bg-white pr-10" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>الموقع الجغرافي على الخريطة</FormLabel>
                                    <FormControl>
                                        <LocationPicker
                                            onLocationSelect={(loc) => field.onChange(loc)}
                                            defaultLocation={field.value as { lat: number; lng: number } | undefined}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>وصف الخدمة <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="اشرح ما تقدمه هذه الخدمة للطلاب..."
                                            className="min-h-[100px] resize-none text-base bg-muted/20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <FormLabel className="block mb-3 text-right">صور الخدمة <span className="text-red-500">*</span></FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border bg-muted group shadow-sm">
                                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-primary">
                                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">رفع صور</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t flex-row-reverse">
                            <Button type="submit" className="flex-1 h-12 text-lg font-bold" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                                        جاري الحفظ...
                                    </>
                                ) : (
                                    "إضافة الخدمة"
                                )}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-12 text-lg">
                                إلغاء
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
