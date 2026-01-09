import { useNavigate } from "react-router-dom";
import { ChevronRight, Share2, Heart, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import type { Accommodation } from "@/data/mockData";
import { AccommodationImageSlider } from "../components/AccommodationImageSlider";
import { AccommodationPropertyInfo } from "../components/AccommodationPropertyInfo";
import { AccommodationPricingCard } from "../components/AccommodationPricingCard";
import { AccommodationHostCard } from "../components/AccommodationHostCard";

interface AccommodationDetailTemplateProps {
    accommodation: Accommodation | undefined;
}

export const AccommodationDetailTemplate = ({ accommodation }: AccommodationDetailTemplateProps) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("تم نسخ رابط الصفحة بنجاح");
    };

    if (!accommodation) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                    <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                        <Info className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">السكن غير موجود</h1>
                    <p className="text-muted-foreground mb-8">عذراً، لم نتمكن من العثور على تفاصيل هذا السكن.</p>
                    <Button onClick={() => navigate("/accommodations")}>العودة لقائمة السكن</Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-fade-in pb-12 px-4 md:px-6">
                {/* Breadcrumbs / Back */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="ghost"
                        className="group hover:text-primary pl-4 -ml-2 h-auto py-2"
                        onClick={() => navigate("/accommodations")}
                    >
                        <ChevronRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
                        العودة للسكن
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full flex items-center gap-1.5 md:gap-2 px-3 md:px-4"
                            onClick={handleShare}
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden xs:inline">مشاركة</span>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className={cn("rounded-full flex items-center gap-1.5 md:gap-2 px-3 md:px-4", isFavorite && "text-destructive border-destructive")}
                            onClick={() => setIsFavorite(!isFavorite)}
                        >
                            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                            <span className="hidden xs:inline">{isFavorite ? 'محفوظ' : 'حفظ'}</span>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
                    {/* Left Column: Media & Details */}
                    <div className="lg:col-span-8 space-y-6 md:space-y-8">
                        <AccommodationImageSlider
                            images={accommodation.images}
                            type={accommodation.type}
                            title={accommodation.title}
                        />

                        <AccommodationPropertyInfo
                            title={accommodation.title}
                            location={accommodation.location}
                            distance={accommodation.distance}
                            rating={accommodation.rating}
                            bedrooms={accommodation.bedrooms}
                            bathrooms={accommodation.bathrooms}
                            description={accommodation.description}
                            amenities={accommodation.amenities}
                        />
                    </div>

                    {/* Right Column: Pricing & Host */}
                    <div className="lg:col-span-4 space-y-6">
                        <AccommodationPricingCard price={accommodation.price} id={accommodation.id} />
                        <AccommodationHostCard
                            hostName={accommodation.hostName}
                            hostAvatar={accommodation.hostAvatar}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
