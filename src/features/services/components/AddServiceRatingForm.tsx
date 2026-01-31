import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { serviceService } from "../services/service.service";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/features/notifications/services/notification.service";

interface AddServiceRatingFormProps {
    serviceId: number;
    onSuccess?: () => void;
    variant?: "default" | "small";
}

export function AddServiceRatingForm({ serviceId, onSuccess, variant = "default" }: AddServiceRatingFormProps) {
    const [stars, setStars] = useState(0);
    const [hoveredStars, setHoveredStars] = useState(0);
    const queryClient = useQueryClient();

    const isSmall = variant === "small";

    const mutation = useMutation({
        mutationFn: (data: { serviceId: number; stars: number }) =>
            serviceService.addRating(data),
        onSuccess: async () => {
            toast.success("تم إضافة تقييمك بنجاح");
            setStars(0);
            queryClient.invalidateQueries({ queryKey: ['service-detail', serviceId.toString()] });
            queryClient.invalidateQueries({ queryKey: ['service-ratings', serviceId] });
            onSuccess?.();

            try {
                // Notify Admins
                const { adminUsersService } = await import('@/features/admin-users/services/admin-users.service');
                const adminsResponse = await adminUsersService.getAllUsers({ Role: 'Admin', pageSize: 100 });

                adminsResponse.users.data.forEach(admin => {
                    notificationService.sendNotification({
                        userId: admin.id,
                        title: "تقييم جديد للخدمة",
                        message: `تم إضافة تقييم جديد لخدمة رقم ${serviceId}. يرجى المراجعة.`
                    });
                });
            } catch (error) {
                console.error("Failed to notify admins", error);
            }

            try {
                // Notify Service Owner
                const service = await serviceService.getServiceById(serviceId);
                if (service.createdUser?.id) {
                    notificationService.sendNotification({
                        userId: service.createdUser.id,
                        title: "تقييم جديد لخدمتك",
                        message: `تم إضافة تقييم جديد لخدمتك: ${service.name}`
                    });
                }
            } catch (error) {
                console.error("Failed to notify service owner", error);
            }
        },
        onError: () => {
            toast.error("فشل في إضافة التقييم");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (stars === 0) {
            toast.error("يرجى اختيار عدد النجوم");
            return;
        }
        mutation.mutate({ serviceId, stars });
    };

    if (isSmall) {
        return (
            <div className="space-y-4">
                <div className="flex justify-center items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="transition-transform hover:scale-110 active:scale-95"
                            onMouseEnter={() => setHoveredStars(star)}
                            onMouseLeave={() => setHoveredStars(0)}
                            onClick={() => setStars(star)}
                        >
                            <Star
                                className={cn(
                                    "w-7 h-7 transition-colors duration-300",
                                    (hoveredStars || stars) >= star
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-white/30"
                                )}
                            />
                        </button>
                    ))}
                </div>
                <Button
                    onClick={handleSubmit}
                    disabled={mutation.isPending || stars === 0}
                    className="w-full rounded-xl py-4 h-auto font-black bg-white text-primary hover:bg-white/90 shadow-lg active:scale-95 transition-all"
                >
                    {mutation.isPending ? "جاري الإرسال..." : "إرسال التقييم"}
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-muted/30 p-8 rounded-[2rem] border border-dashed border-primary/20">
            <div className="space-y-2">
                <h4 className="font-black text-xl tracking-tight">هل زرت هذا المكان من قبل؟</h4>
                <p className="text-sm font-medium text-muted-foreground">شارك تقييمك مع زملائك الطلاب لمساعدتهم.</p>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="p-1 transition-transform hover:scale-110 active:scale-95"
                            onMouseEnter={() => setHoveredStars(star)}
                            onMouseLeave={() => setHoveredStars(0)}
                            onClick={() => setStars(star)}
                        >
                            <Star
                                className={cn(
                                    "w-10 h-10 transition-colors duration-300",
                                    (hoveredStars || stars) >= star
                                        ? "text-amber-500 fill-amber-500 drop-shadow-sm"
                                        : "text-muted-foreground/30"
                                )}
                            />
                        </button>
                    ))}
                    <div className="mr-4 px-4 py-1.5 bg-background rounded-full border border-border/50 shadow-sm">
                        <span className="text-sm font-black text-primary">
                            {stars > 0 ? `${stars} من 5` : "اختر التقييم"}
                        </span>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={mutation.isPending || stars === 0}
                    className="w-full h-14 rounded-2xl font-black text-lg gap-3 shadow-xl transition-all shadow-primary/20 active:scale-[0.98]"
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            جاري الإرسال...
                        </>
                    ) : (
                        <>
                            <Star className="w-5 h-5" />
                            إرسال التقييم
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
