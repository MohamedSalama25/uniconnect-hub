import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, MapPin, Loader2, Edit, Phone, Clock, Type, Info } from "lucide-react";
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
import { LocationPicker } from "./LocationPicker";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";
import { useCreateService } from "@/features/services/hooks/useCreateService";
import { useUpdateService } from "@/features/services/hooks/useUpdateService";
import { Service } from "@/features/services/types/service.types";
import { useQuery } from "@tanstack/react-query";
import { adminSettingsService } from "@/features/admin-settings/services/admin-settings.service";
import { IconRenderer } from "./IconRenderer";

const formSchema = z.object({
    name: z.string().min(3, { message: "اسم الخدمة يجب أن يكون 3 أحرف على الأقل" }),
    description: z.string().min(10, { message: "الوصف يجب أن يكون 10 أحرف على الأقل" }),
    serviceCategoryId: z.string().min(1, { message: "يرجى اختيار نوع الخدمة" }),
    address: z.string().min(5, { message: "يرجى إدخال العنوان بالتفصيل" }),
    phone: z.string().min(10, { message: "يرجى إدخال رقم هاتف صحيح" }),
    workingFrom: z.string().min(1, { message: "يرجى تحديد وقت البدء" }),
    workingTo: z.string().min(1, { message: "يرجى تحديد وقت الانتهاء" }),
    location: z.object({
        lat: z.number(),
        lng: z.number()
    }).optional(),
});

interface AddServiceDialogProps {
    trigger?: React.ReactNode;
    triggerClassName?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    initialData?: Service; // For Edit Mode
}

export function AddServiceDialog({
    trigger,
    triggerClassName,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    initialData
}: AddServiceDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const setOpen = controlledOpen !== undefined ? setControlledOpen : setInternalOpen;

    const createServiceMutation = useCreateService();
    const updateServiceMutation = useUpdateService();
    const isEditMode = !!initialData;

    // Fetch service categories
    const { data: categoriesData } = useQuery({
        queryKey: ["service-categories"],
        queryFn: () => adminSettingsService.getServiceCategories({ pageSize: 100 }),
    });
    const categories = categoriesData?.data || [];

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            serviceCategoryId: "",
            address: "",
            phone: "",
            workingFrom: "09:00",
            workingTo: "17:00",
        },
    });
    useEffect(() => {
        const formatTime = (time: any) => {
            if (!time) return "09:00";
            if (typeof time === 'string') return time.split(':').slice(0, 2).join(':');
            if (time.hours !== undefined && time.minutes !== undefined) {
                return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
            }
            return "09:00";
        };

        if (initialData && open && isEditMode) {
            form.reset({
                name: initialData.name,
                description: initialData.description,
                serviceCategoryId: initialData.serviceCategoryId.toString(),
                address: initialData.address,
                phone: initialData.phone,
                workingFrom: formatTime(initialData.workingFrom),
                workingTo: formatTime(initialData.workingTo),
                location: {
                    lat: initialData.latitude || 0,
                    lng: initialData.longitude || 0
                },
            });
        } else if (!isEditMode && open) {
            form.reset({
                name: "",
                description: "",
                serviceCategoryId: "",
                address: "",
                phone: "",
                workingFrom: "09:00",
                workingTo: "17:00",
                location: { lat: 0, lng: 0 }
            });
        }
    }, [initialData, open, form, isEditMode]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const requestData = {
            name: values.name,
            serviceCategoryId: parseInt(values.serviceCategoryId),
            description: values.description,
            address: values.address,
            phone: values.phone,
            latitude: values.location?.lat || 0,
            longitude: values.location?.lng || 0,
            workingFrom: `${values.workingFrom}:00`,
            workingTo: `${values.workingTo}:00`
        };

        if (isEditMode && initialData) {
            updateServiceMutation.mutate({ id: initialData.id, data: requestData }, {
                onSuccess: () => setOpen(false)
            });
        } else {
            createServiceMutation.mutate(requestData, {
                onSuccess: () => {
                    setOpen(false);
                    form.reset();
                }
            });
        }
    };

    const isLoading = createServiceMutation.isPending || updateServiceMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger !== null && (
                <DialogTrigger asChild>
                    {trigger || (
                        <Button className={cn("gap-2 font-bold shadow-lg shadow-primary/20", triggerClassName)}>
                            <Plus className="w-5 h-5" />
                            <span>إضافة خدمة</span>
                        </Button>
                    )}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {isEditMode ? "تعديل بيانات الخدمة" : "إضافة خدمة جديدة"}
                    </DialogTitle>
                    <DialogDescription>
                        أدخل تفاصيل الخدمة التي تقدمها لمساعدة الآخرين والوصول لأكبر عدد من المستفيدين.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>اسم الخدمة <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Info className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input placeholder="مثال: توصيل مشاوير، صيانة..." className="h-12 bg-background pr-10" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="serviceCategoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>نوع الخدمة <span className="text-red-500">*</span></FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger dir="rtl" className="h-12 text-base">
                                                    <SelectValue placeholder="اختر نوع الخدمة" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent dir="rtl">
                                                {categories?.map((cat) => (
                                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                                        <div className="flex items-center gap-3 py-1">
                                                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                                                <IconRenderer name={cat.icon || ""} size={16} />
                                                            </div>
                                                            <span className="font-medium text-sm">{cat.name}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>رقم التواصل <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                <Input placeholder="01xxxxxxxxx" className="h-12 bg-background pr-10" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="workingFrom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>من ساعة</FormLabel>
                                            <FormControl>
                                                <TimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="اختر وقت البدء"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="workingTo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>إلى ساعة</FormLabel>
                                            <FormControl>
                                                <TimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="اختر وقت الانتهاء"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>العنوان</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input placeholder="الحي، اسم الشارع، رقم المبنى" className="h-12 bg-background pr-10" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>وصف الخدمة <span className="text-red-500">*</span></FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="اوصف الخدمة والمميزات..."
                                            className="min-h-[100px] resize-none text-base bg-background"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-12 px-6">
                                إلغاء
                            </Button>
                            <Button type="submit" className="h-12 px-8 font-bold gap-2" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {isEditMode ? "جاري التحديث..." : "جاري الإضافة..."}
                                    </>
                                ) : (
                                    <>
                                        {isEditMode ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                        {isEditMode ? "حفظ التعديلات" : "إضافة الخدمة"}
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
