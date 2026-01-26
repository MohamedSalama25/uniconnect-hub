import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Loader2,
    Hospital,
    Utensils,
    Bus,
    ShoppingCart,
    Wrench,
    Briefcase,
    GraduationCap,
    Heart,
    Home,
    Car,
    Coffee,
    Landmark,
    Check
} from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { Button } from "@/components/ui/button";
import { ServiceCategory } from "../types/admin-settings.types";
import { adminSettingsService } from "../services/admin-settings.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

const AVAILABLE_ICONS = [
    { name: "hospital", icon: Hospital, label: "مستشفى" },
    { name: "utensils", icon: Utensils, label: "مطعم" },
    { name: "bus", icon: Bus, label: "نقل" },
    { name: "shopping-cart", icon: ShoppingCart, label: "تسوق" },
    { name: "wrench", icon: Wrench, label: "صيانة" },
    { name: "briefcase", icon: Briefcase, label: "خدمات" },
    { name: "graduation-cap", icon: GraduationCap, label: "تعليم" },
    { name: "heart", icon: Heart, label: "صحة" },
    { name: "home", icon: Home, label: "سكن" },
    { name: "car", icon: Car, label: "تاكسي" },
    { name: "coffee", icon: Coffee, label: "كافيه" },
    { name: "landmark", icon: Landmark, label: "بنوك" },
];

const formSchema = z.object({
    name: z.string().min(2, { message: "اسم القسم يجب أن يكون حرفين على الأقل" }),
    icon: z.string().min(1, { message: "يجب اختيار أيقونة للقسم" }),
});

interface AddEditServiceCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: ServiceCategory | null;
}

export function AddEditServiceCategoryDialog({
    open,
    onOpenChange,
    initialData,
}: AddEditServiceCategoryDialogProps) {
    const queryClient = useQueryClient();
    const isEditMode = !!initialData;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
            icon: initialData?.icon || "",
        },
    });

    // Reset form when initialData changes
    useEffect(() => {
        if (open) {
            form.reset({
                name: initialData?.name || "",
                icon: initialData?.icon || "",
            });
        }
    }, [initialData, open, form]);

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            if (isEditMode && initialData) {
                return adminSettingsService.updateServiceCategory(initialData.id, values.name, values.icon);
            } else {
                return adminSettingsService.createServiceCategory(values.name, values.icon);
            }
        },
        onSuccess: () => {
            toast.success(isEditMode ? "تم تحديث قسم الخدمة بنجاح" : "تم إضافة قسم الخدمة بنجاح");
            queryClient.invalidateQueries({ queryKey: ["service-categories"] });
            onOpenChange(false);
            form.reset();
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.errors?.[0] || error.response?.data?.message || "حدث خطأ ما";
            toast.error(errorMsg);
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent dir="rtl" className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "تعديل قسم الخدمة" : "إضافة قسم خدمة جديد"}</DialogTitle>
                    <DialogDescription>
                        أدخل اسم واختر أيقونة قسم الخدمة الجديد هنا. اضغط حفظ عند الانتهاء.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-bold">اسم القسم</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="مثال: نقل عفش"
                                            {...field}
                                            className="h-12 bg-muted/40 border-none rounded-xl focus-visible:ring-primary/20"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="icon"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-base font-bold">اختر أيقونة</FormLabel>
                                    <FormControl>
                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                            {AVAILABLE_ICONS.map((item) => {
                                                const isSelected = field.value === item.name;
                                                return (
                                                    <button
                                                        key={item.name}
                                                        type="button"
                                                        onClick={() => field.onChange(item.name)}
                                                        className={cn(
                                                            "relative flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all group",
                                                            isSelected
                                                                ? "border-primary bg-primary/5 shadow-md"
                                                                : "border-transparent bg-muted/30 hover:bg-muted/50"
                                                        )}
                                                        title={item.label}
                                                    >
                                                        <item.icon className={cn(
                                                            "w-6 h-6 transition-transform group-hover:scale-110",
                                                            isSelected ? "text-primary" : "text-muted-foreground"
                                                        )} />
                                                        {isSelected && (
                                                            <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full p-0.5">
                                                                <Check className="w-3 h-3" />
                                                            </div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-2">
                            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold h-12 px-8">
                                إلغاء
                            </Button>
                            <Button type="submit" disabled={mutation.isPending} className="rounded-xl font-bold h-12 px-10 shadow-lg shadow-primary/20">
                                {mutation.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                حفظ القسم
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
