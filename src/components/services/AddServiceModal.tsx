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

const formSchema = z.object({
    name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    category: z.enum(["restaurant", "pharmacy", "hospital", "laundry", "transportation"], {
        required_error: "يرجى اختيار القسم",
    }),
    description: z.string().min(10, "الوصف يجب أن يكون 10 أحرف على الأقل"),
    rating: z.string().transform((val) => Number(val)).refine((n) => n >= 0 && n <= 5, "التقييم يجب أن يكون بين 0 و 5"),
    image: z.string().url("يرجى إدخال رابط صورة صحيح"),
});

interface AddServiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddServiceModal({ open, onOpenChange }: AddServiceModalProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            image: "https://images.unsplash.com/photo-1517248135467-4c7ed9d41432?w=800&auto=format&fit=crop&q=60",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        toast.success("تم إضافة الخدمة بنجاح (موك)");
        onOpenChange(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-right">إضافة خدمة جديدة</DialogTitle>
                    <DialogDescription className="text-right">
                        أدخل تفاصيل الخدمة الجديدة هنا.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>اسم الخدمة</FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثال: مطعم النور" {...field} className="text-right" />
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
                                    <FormLabel>القسم</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger dir="rtl">
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
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem className="text-right">
                                    <FormLabel>الوصف</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="وصف مختصر للخدمة..."
                                            className="resize-none text-right"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4 text-right">
                            <FormField
                                control={form.control}
                                name="rating"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>التقييم (0-5)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" {...field} className="text-right" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رابط الصورة</FormLabel>
                                        <FormControl>
                                            <Input {...field} className="text-right" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="mt-6 flex gap-2">
                            <Button type="submit" className="flex-1">حفظ الخدمة</Button>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
