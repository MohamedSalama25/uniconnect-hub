
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Upload, X, Loader2, Home, MapPin, Bath, BedDouble, Users, Wifi, Wind, Waves, Coffee, ShieldCheck, GraduationCap } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LocationPicker } from "./LocationPicker";
import { cn } from "@/lib/utils";

const amenitiesOptions = [
    { id: "wifi", label: "واي فاي", icon: Wifi },
    { id: "ac", label: "مكيف", icon: Wind },
    { id: "laundry", label: "غسالة", icon: Waves },
    { id: "kitchen", label: "مطبخ مجهز", icon: Coffee },
    { id: "security", label: "أمن 24 ساعة", icon: ShieldCheck },
    { id: "study", label: "منطقة دراسة", icon: GraduationCap },
];

const formSchema = z.object({
    title: z.string().min(5, { message: "عنوان المنشور يجب أن يكون 5 أحرف على الأقل" }),
    description: z.string().min(20, { message: "الوصف يجب أن يكون 20 حرفاً على الأقل" }),
    price: z.string().min(1, { message: "يرجى تحديد السعر" }),
    phone: z.string().min(10, { message: "رقم الهاتف غير صحيح" }),
    rooms: z.string().min(1, { message: "يرجى تحديد عدد الغرف" }),
    bathrooms: z.string().min(1, { message: "يرجى تحديد عدد دورات المياه" }),
    accommodationType: z.enum(["individual", "shared"]),
    address: z.string().min(5, { message: "يرجى إدخال العنوان بالتفصيل" }),
    amenities: z.array(z.string()).default([]),
    location: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional(),
});

interface AddAccommodationDialogProps {
    trigger?: React.ReactNode;
    triggerClassName?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function AddAccommodationDialog({ trigger, triggerClassName, open: controlledOpen, onOpenChange: setControlledOpen }: AddAccommodationDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = setControlledOpen !== undefined ? setControlledOpen : setInternalOpen;

    const [images, setImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            price: "",
            phone: "",
            rooms: "",
            bathrooms: "",
            accommodationType: "individual",
            address: "",
            amenities: [],
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (images.length === 0) {
            toast.error("يرجى إضافة صورة واحدة على الأقل");
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log({ ...values, images });
        toast.success("تم إضافة السكن بنجاح!", {
            description: "سيتم مراجعة طلبك من قبل المشرفين قبل النشر."
        });

        setIsSubmitting(false);
        setOpen(false);
        form.reset();
        setImages([]);
    };

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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className={cn("gap-2 font-bold shadow-lg shadow-primary/20", triggerClassName)}>
                        <Plus className="w-5 h-5" />
                        <span>إضافة سكن</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">إضافة سكن جديد</DialogTitle>
                    <DialogDescription>
                        أدخل تفاصيل السكن المتاح لضمان الحصول على أفضل المستأجرين.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>عنوان الإعلان <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="مثال: شقة للإيجار حي النرجس..." className="h-12 text-base" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="accommodationType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>نوع السكن <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="h-12 text-base">
                                                    <SelectValue placeholder="اختر نوع السكن" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="individual">غرفة فردية</SelectItem>
                                                <SelectItem value="shared">سكن مشترك</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 flex items-center gap-2 text-blue-700 font-bold border-b border-blue-200 pb-2 mb-2">
                                <Home className="w-5 h-5" />
                                تفاصيل السكن
                            </div>

                            <FormField
                                control={form.control}
                                name="rooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>عدد الغرف</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <BedDouble className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input type="number" placeholder="مثال: 3" className="h-12 bg-white pr-10" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="bathrooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>عدد دورات المياه</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Bath className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input type="number" placeholder="مثال: 2" className="h-12 bg-white pr-10" {...field} />
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
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>العنوان بالتفصيل</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input placeholder="الحي، اسم الشارع، رقم المبنى" className="h-12 bg-white pr-10" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Amenities Selection */}
                        <div className="space-y-4">
                            <FormLabel className="text-lg font-bold">المرافق المتاحة</FormLabel>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {amenitiesOptions.map((option) => (
                                    <FormField
                                        key={option.id}
                                        control={form.control}
                                        name="amenities"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    key={option.id}
                                                    className="flex flex-row items-center space-x-3 space-y-0 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(option.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, option.id])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== option.id
                                                                        )
                                                                    );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="flex items-center gap-2 font-medium cursor-pointer pr-2">
                                                        <option.icon className="w-4 h-4 text-primary" />
                                                        {option.label}
                                                    </FormLabel>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Location Picker */}
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>تحديد الموقع على الخريطة</FormLabel>
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

                        {/* Description */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>وصف السكن <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="اوصف السكن والمميزات الإضافية..."
                                            className="min-h-[120px] resize-none text-base bg-muted/20"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Images */}
                        <div>
                            <FormLabel className="block mb-3">صور السكن (اختر صور متعددة) <span className="text-red-500">*</span></FormLabel>
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
                                <label className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                                    <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">رفع صور</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </div>

                        {/* Price & Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/20 p-6 rounded-xl">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>السعر شهرياً <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="مثال: 3500 جنيه" className="h-12 bg-white" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رقم التواصل <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="01xxxxxxxxx" className="h-12 dir-ltr bg-white" style={{ direction: 'ltr', textAlign: 'right' }} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-12 px-6">
                                إلغاء
                            </Button>
                            <Button type="submit" className="h-12 px-8 font-bold gap-2" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        جاري الإضافة...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        إضافة السكن
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
