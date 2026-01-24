import { Star, Trash2, Loader2, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Rating } from "@/features/accommodation-list/types/house.types";
import { useAuthStore } from "@/store/useAuthStore";
import { formatDate } from "@/lib/utils";
import { houseService } from "@/features/accommodation-list/services/house.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";

interface AccommodationReviewsProps {
    houseId: number;
    ratings: Rating[];
}

export function AccommodationReviews({ houseId, ratings }: AccommodationReviewsProps) {
    const { user, fullProfile } = useAuthStore();
    const currentUserId = fullProfile?.id || (user as any)?.id;
    const queryClient = useQueryClient();
    const [ratingToDelete, setRatingToDelete] = useState<number | null>(null);

    const deleteMutation = useMutation({
        mutationFn: (id: number) => houseService.deleteRating(id),
        onSuccess: () => {
            toast.success("تم حذف التقييم بنجاح");
            queryClient.invalidateQueries({ queryKey: ['public-house', houseId.toString()] });
            setRatingToDelete(null);
        },
        onError: () => {
            toast.error("فشل في حذف التقييم");
        }
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">تقييمات المستخدمين ({ratings.length})</h3>
            </div>

            <div className="space-y-6">
                {ratings.length === 0 ? (
                    <div className="text-center py-10 bg-muted/20 rounded-2xl border border-dashed">
                        <p className="text-muted-foreground italic">لا توجد تقييمات بعد. كن أول من يقيم!</p>
                    </div>
                ) : (
                    ratings.map((rating) => (
                        <div key={rating.id} className="flex gap-4 p-4 rounded-2xl bg-card border shadow-sm relative group">
                            <Avatar className="w-12 h-12 border">
                                <AvatarImage src={rating.userPhotoUrl} alt={rating.userName} />
                                <AvatarFallback>{rating.userName.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h5 className="font-bold leading-none mb-1">{rating.userName}</h5>
                                        <p className="text-xs text-muted-foreground">{formatDate(rating.ratedOn)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-0.5 bg-accent/10 px-2 py-1 rounded-lg text-accent">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            <span className="text-sm font-black">{rating.stars}</span>
                                        </div>

                                        {/* Review Actions for Owner Only */}
                                        {String(rating.userId) === String(currentUserId) && (
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="w-8 h-8 rounded-full transition-all hover:bg-muted"
                                                    >
                                                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="rounded-xl shadow-xl border-none p-1 bg-card">
                                                    <DropdownMenuItem
                                                        onClick={() => setRatingToDelete(rating.id)}
                                                        className="flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg cursor-pointer font-bold"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span>حذف التقييم</span>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        )}
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed italic pr-1">
                                    "{rating.comment}"
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ConfirmDialog
                isOpen={!!ratingToDelete}
                onClose={() => setRatingToDelete(null)}
                onConfirm={() => ratingToDelete && deleteMutation.mutate(ratingToDelete)}
                title="حذف التقييم"
                description="هل أنت متأكد من حذف تقييمك؟ لا يمكن التراجع عن هذا الإجراء."
                variant="destructive"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
