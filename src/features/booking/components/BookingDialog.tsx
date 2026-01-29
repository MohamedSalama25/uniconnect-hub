import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar as CalendarIcon, Clock, MessageSquare, Loader2, Send, Edit } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/time-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { useCreateAppointment, useUpdateAppointment } from "../hooks/useAppointments";
import { Appointment } from "../services/appointment.service";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    appointmentDate: z.string().min(1, { message: "يرجى اختيار تاريخ الموعد" }),
    appointmentTime: z.string().min(1, { message: "يرجى اختيار وقت الموعد" }),
    tenantMessage: z.string().min(10, { message: "الرسالة يجب أن تكون 10 أحرف على الأقل" }),
});

interface BookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    houseId?: number;
    initialData?: Appointment; // For Edit Mode
}

export function BookingDialog({
    open,
    onOpenChange,
    houseId,
    initialData
}: BookingDialogProps) {
    const isEditMode = !!initialData;
    const createMutation = useCreateAppointment();
    const updateMutation = useUpdateAppointment();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            appointmentDate: "",
            appointmentTime: "",
            tenantMessage: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (isEditMode && initialData) {
                form.reset({
                    appointmentDate: initialData.appointmentDate.split('T')[0],
                    appointmentTime: initialData.appointmentTime,
                    tenantMessage: initialData.tenantMessage,
                });
            } else {
                form.reset({
                    appointmentDate: new Date().toISOString().split('T')[0],
                    appointmentTime: "",
                    tenantMessage: "",
                });
            }
        }
    }, [open, initialData, isEditMode, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        if (isEditMode && initialData) {
            updateMutation.mutate({
                id: initialData.id,
                data: values
            }, {
                onSuccess: () => onOpenChange(false),
            });
        } else if (houseId) {
            createMutation.mutate({
                houseId,
                appointmentDate: values.appointmentDate,
                appointmentTime: values.appointmentTime,
                tenantMessage: values.tenantMessage,
            }, {
                onSuccess: () => onOpenChange(false),
            });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-3xl" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        {isEditMode ? <Edit className="w-6 h-6 text-primary" /> : <CalendarIcon className="w-6 h-6 text-primary" />}
                        {isEditMode ? "تعديل موعد المعاينة" : "حجز موعد للمعاينة"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode ? "قم بتعديل تفاصيل الموعد والرسالة." : "اختر الموعد المناسب لك وسيتواصل معك المالك للتأكيد."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="appointmentDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>التاريخ</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="اختر تاريخ المعاينة"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="appointmentTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>الوقت</FormLabel>
                                        <FormControl>
                                            <TimePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="اختر وقت المعاينة"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="tenantMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>رسالة للمالك</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <MessageSquare className="absolute right-3 top-4 w-4 h-4 text-muted-foreground" />
                                            <Textarea
                                                placeholder="اكتب رسالتك للمالك هنا..."
                                                className="min-h-[120px] resize-none pr-10 rounded-2xl bg-background text-base"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-3 pt-2">
                            <Button
                                type="submit"
                                className="flex-1 h-12 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5" />
                                )}
                                {isEditMode ? "حفظ التعديلات" : "إرسال طلب الحجز"}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                className="flex-1 h-12 rounded-xl font-bold"
                                onClick={() => onOpenChange(false)}
                            >
                                إلغاء
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
