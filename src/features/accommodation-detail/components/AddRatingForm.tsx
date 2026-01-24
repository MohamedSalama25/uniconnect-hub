import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { houseService } from "@/features/accommodation-list/services/house.service";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddRatingFormProps {
    houseId: number;
    onSuccess?: () => void;
}

export function AddRatingForm({ houseId, onSuccess }: AddRatingFormProps) {
    const [stars, setStars] = useState(0);
    const [hoveredStars, setHoveredStars] = useState(0);
    const [comment, setComment] = useState("");
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: { houseId: number; stars: number; comment: string }) =>
            houseService.addRating(data),
        onSuccess: () => {
            toast.success("تم إضافة تقييمك بنجاح");
            setStars(0);
            setComment("");
            queryClient.invalidateQueries({ queryKey: ['public-house', houseId.toString()] });
            onSuccess?.();
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
        if (comment.length < 5) {
            toast.error("التعليق قصير جداً");
            return;
        }
        mutation.mutate({ houseId, stars, comment });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-muted/30 p-6 rounded-2xl border border-dashed">
            <div className="space-y-2">
                <h4 className="font-bold text-lg">أضف تقييمك</h4>
                <p className="text-sm text-muted-foreground">شارك تجربتك مع الآخرين لمساعدتهم في اختيار السكن المناسب.</p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            className="p-1 transition-transform hover:scale-110"
                            onMouseEnter={() => setHoveredStars(star)}
                            onMouseLeave={() => setHoveredStars(0)}
                            onClick={() => setStars(star)}
                        >
                            <Star
                                className={cn(
                                    "w-8 h-8 transition-colors",
                                    (hoveredStars || stars) >= star
                                        ? "text-accent fill-accent"
                                        : "text-muted-foreground/30"
                                )}
                            />
                        </button>
                    ))}
                    <span className="mr-2 text-sm font-medium text-muted-foreground">
                        {stars > 0 ? `${stars} من 5` : "اختر التقييم"}
                    </span>
                </div>

                <div className="space-y-3">
                    <Textarea
                        placeholder="اكتب تعليقك هنا عن جودة السكن، المرافق، أو التعامل مع المالك..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px] rounded-xl bg-background resize-none text-base"
                    />
                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full md:w-auto px-8 h-12 rounded-xl font-bold gap-2"
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                جاري الإرسال...
                            </>
                        ) : (
                            "إرسال التقييم"
                        )}
                    </Button>
                </div>
            </div>
        </form>
    );
}
