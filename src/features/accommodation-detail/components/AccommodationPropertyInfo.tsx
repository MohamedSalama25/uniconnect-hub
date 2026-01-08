import { MapPin, Star, Bed, Bath, Calendar } from "lucide-react";

interface AccommodationPropertyInfoProps {
    title: string;
    location: string;
    distance: number;
    rating: number;
    bedrooms: number;
    bathrooms: number;
    description: string;
    amenities: string[];
}

export const AccommodationPropertyInfo = ({
    title,
    location,
    distance,
    rating,
    bedrooms,
    bathrooms,
    description,
    amenities,
}: AccommodationPropertyInfoProps) => {
    return (
        <div className="bg-card rounded-3xl p-8 border shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black">{title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span className="text-lg">{location}</span>
                        <span className="text-primary font-bold">({distance} كم من الجامعة)</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-2xl">
                    <Star className="w-6 h-6 text-accent fill-accent" />
                    <span className="text-2xl font-black text-foreground">{rating}</span>
                    <span className="text-muted-foreground text-sm">(12 تقييم)</span>
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
