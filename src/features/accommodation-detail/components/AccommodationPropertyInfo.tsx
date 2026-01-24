import { MapPin, Star, Bed, Bath, Calendar, Map as MapIcon } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LocationViewer } from "@/components/globalComponents/LocationViewer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AccommodationPropertyInfoProps {
    title: string;
    location: string;
    totalRating: number;
    rating: number;
    bedrooms: number;
    bathrooms: number;
    description: string;
    amenities: string[];
    lat?: number;
    lng?: number;
}

export const AccommodationPropertyInfo = ({
    title,
    location,
    totalRating,
    rating,
    bedrooms,
    bathrooms,
    description,
    amenities,
    lat,
    lng,
}: AccommodationPropertyInfoProps) => {
    const [isMapOpen, setIsMapOpen] = useState(false);
    return (
        <div className="bg-card rounded-3xl p-6 md:p-8 border shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-black leading-tight">{title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
                        <span className="text-base md:text-lg line-clamp-1">{location}</span>

                        {(lat !== undefined && lng !== undefined) && (
                            <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all scale-90 md:scale-100"
                                        title="عرض على الخريطة"
                                    >
                                        <MapIcon className="w-4 h-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-3xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                                    <div className="p-6 bg-card border-b">
                                        <DialogHeader>
                                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-primary" />
                                                موقع السكن: {title}
                                            </DialogTitle>
                                        </DialogHeader>
                                    </div>
                                    <div className="p-4 md:p-6 bg-muted/20">
                                        <LocationViewer lat={lat} lng={lng} title={title} className="bg-background rounded-2xl p-4 shadow-sm border" />
                                        <p className="mt-4 text-sm text-muted-foreground text-center">
                                            {location}
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-accent/10 px-3 py-1.5 md:px-4 md:py-2 rounded-2xl w-fit">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-accent fill-accent" />
                    <span className="text-xl md:text-2xl font-black text-foreground">{rating}</span>
                    <span className="text-muted-foreground text-xs md:text-sm">{totalRating} تقييم</span>
                </div>
            </div>

            <div className="flex items-center gap-8 py-4 border-y overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-3 whitespace-nowrap">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Bed className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">غرف النوم</p>
                        <p className="font-bold">{bedrooms} غرف</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 whitespace-nowrap">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Bath className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">الحمامات</p>
                        <p className="font-bold">{bathrooms} حمامات</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 whitespace-nowrap">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">متاح من</p>
                        <p className="font-bold">1 فبراير، 2026</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold">عن هذا السكن</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                    {description}
                </p>
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="text-xl font-bold">المرافق والخدمات</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span className="font-medium">{amenity}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
