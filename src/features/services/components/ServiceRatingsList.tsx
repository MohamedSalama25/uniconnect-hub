import { useQuery } from "@tanstack/react-query";
import { Star, MessageCircle, Calendar } from "lucide-react";
import { serviceService } from "../services/service.service";
import { formatDate, cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceRatingsListProps {
    serviceId: number;
}

export function ServiceRatingsList({ serviceId }: ServiceRatingsListProps) {
    const { data: ratings, isLoading } = useQuery({
        queryKey: ["service-ratings", serviceId],
        queryFn: () => serviceService.getRatings(serviceId),
    });

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-3xl" />
                ))}
            </div>
        );
    }

    if (!ratings || ratings.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/20 rounded-[2.5rem] border border-dashed">
                <div className="bg-muted p-4 rounded-full w-fit mx-auto mb-4">
                    <Star className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-bold text-lg">لا توجد تقييمات بعد</h3>
                <p className="text-muted-foreground text-sm">كن أول من يشارك تجرنبه مع هذه الخدمة!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 text-primary border-b border-border/10 pb-4 mb-6">
                <MessageCircle className="w-6 h-6" />
                <h2 className="text-2xl font-black uppercase tracking-tight">تقييمات الطلاب ({ratings.length})</h2>
            </div>

            <div className="grid gap-4">
                {ratings.map((rating) => (
                    <Card key={rating.id} className="border-none shadow-xl rounded-[2rem] bg-background hover:scale-[1.01] transition-transform duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-12 h-12 border-2 border-primary/10">
                                        <AvatarImage src={rating.createdUser?.profilePictureUrl} />
                                        <AvatarFallback className="bg-primary/5 text-primary font-black uppercase">
                                            {(rating.createdUser?.username || "م")[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h4 className="font-black text-lg">{rating.createdUser?.username || "غير معروف"}</h4>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-amber-500">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={cn("w-3.5 h-3.5", s <= rating.stars ? "fill-current" : "text-muted-foreground/30")}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1 font-bold">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(rating.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}


