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
import { HelpRequestType } from "../types/admin-settings.types";
import { adminSettingsService } from "../services/admin-settings.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
    name: z.string().min(2, { message: "اسم النوع يجب أن يكون حرفين على الأقل" }),
});

interface AddEditHelpRequestTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: HelpRequestType | null;
}

export function AddEditHelpRequestTypeDialog({
    open,
    onOpenChange,
    initialData,
}: AddEditHelpRequestTypeDialogProps) {
    const queryClient = useQueryClient();
    const isEditMode = !!initialData;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name || "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: initialData?.name || "",
            });
        }
    }, [initialData, open, form]);

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            if (isEditMode && initialData) {
                return adminSettingsService.updateHelpRequestType(initialData.id, values.name);
            } else {
                return adminSettingsService.createHelpRequestType(values.name);
            }
        },
        onSuccess: () => {
            toast.success(isEditMode ? "تم تحديث نوع الطلب بنجاح" : "تم إضافة نوع الطلب بنجاح");
            queryClient.invalidateQueries({ queryKey: ["help-request-types"] });
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
            <DialogContent dir="rtl" className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "تعديل نوع الطلب" : "إضافة نوع طلب جديد"}</DialogTitle>
                    <DialogDescription>
                        أدخل تفاصيل نوع طلب المساعدة هنا. اضغط حفظ عند الانتهاء.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base font-bold">اسم النوع</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="مثال: مساعدة طبية"
                                            {...field}
                                            className="h-12 bg-muted/40 border-none rounded-xl focus-visible:ring-primary/20"
                                        />
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
                                حفظ النوع
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
