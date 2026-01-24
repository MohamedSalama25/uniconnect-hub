import { useParams } from "react-router-dom";
import { AccommodationDetailTemplate } from "@/features/accommodation-detail/templates/AccommodationDetailTemplate";
import { useQuery } from "@tanstack/react-query";
import { houseService } from "@/features/accommodation-list/services/house.service";
import { House } from "@/features/accommodation-list/types/house.types";
import { Accommodation } from "@/data/mockData";
import { Loader2 } from "lucide-react";

const AccommodationDetail = () => {
    const { id } = useParams();

    const { data: house, isLoading } = useQuery({
        queryKey: ['public-house', id],
        queryFn: () => houseService.getPublicHouseById(Number(id)),
        enabled: !!id
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    const mapHouseToAccommodation = (house: House | undefined): Accommodation | undefined => {
        if (!house) return undefined;
        return {
            id: house.id.toString(),
            title: house.name,
            image: house.imageUrls?.[0] || "",
            images: house.imageUrls || [],
            price: house.price,
            distance: 0,
            type: house.typeName?.toLowerCase().includes('shared') ? 'shared' : 'private',
            rating: house.averageRating,
            location: house.address,
            bedrooms: house.numberOfRooms,
            bathrooms: house.numberOfBathrooms,
            amenities: house.facilityNames || [],
            description: house.description,
            hostName: house.createdByName,
            hostAvatar: house.createdByPhotoUrl,
            createdById: house.createdById,
            isFavorite: house.isFavorite,
        };
    };

    return <AccommodationDetailTemplate accommodation={mapHouseToAccommodation(house)} />;
};

export default AccommodationDetail;
