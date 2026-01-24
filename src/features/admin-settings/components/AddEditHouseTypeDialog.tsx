import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
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
import { HouseType } from "../types/admin-settings.types";
import { adminSettingsService } from "../services/admin-settings.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
    name: z.string().min(2, { message: "اسم النوع يجب أن يكون حرفين على الأقل" }),
});

interface AddEditHouseTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: HouseType | null;
}

export function AddEditHouseTypeDialog({
    open,
    onOpenChange,
    initialData,
}: AddEditHouseTypeDialogProps) {
    const queryClient = useQueryClient();
    const isEditMode = !!initialData;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.typeName || "",
        },
    });

    // Reset form when initialData changes
    useEffect(() => {
        if (open) {
            form.reset({
                name: initialData?.typeName || "",
            });
        }
    }, [initialData, open, form]);

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            if (isEditMode && initialData) {
                return adminSettingsService.updateHouseType(initialData.id, values.name);
            } else {
                return adminSettingsService.createHouseType(values.name);
            }
        },
        onSuccess: () => {
            toast.success(isEditMode ? "تم تحديث نوع السكن بنجاح" : "تم إضافة نوع السكن بنجاح");
            queryClient.invalidateQueries({ queryKey: ["house-types"] });
            onOpenChange(false);
            form.reset();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "حدث خطأ ما");
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        mutation.mutate(values);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent dir="rtl">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "تعديل نوع السكن" : "إضافة نوع سكن جديد"}</DialogTitle>
                    <DialogDescription>
                        أدخل اسم نوع السكن الجديد هنا. اضغط حفظ عند الانتهاء.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>اسم النوع</FormLabel>
                                    <FormControl>
                                        <Input placeholder="مثال: سكن مشترك" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                إلغاء
                            </Button>
                            <Button type="submit" disabled={mutation.isPending}>
                                {mutation.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                                حفظ
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
