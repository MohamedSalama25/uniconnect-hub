import { useParams } from "react-router-dom";
import { AccommodationDetailTemplate } from "@/features/accommodation-detail/templates/AccommodationDetailTemplate";
import { useQuery } from "@tanstack/react-query";
import { houseService } from "@/features/accommodation-list/services/house.service";
import { House } from "@/features/accommodation-list/types/house.types";
import { Accommodation } from "@/data/mockData";
import { Loader } from "lucide-react";
import { CustomLoader } from "@/components/ui/loader";

const AccommodationDetail = () => {
    const { id } = useParams();

    const { data: house, isLoading } = useQuery({
        queryKey: ['public-house', id],
        queryFn: () => houseService.getPublicHouseById(Number(id)),
        enabled: !!id
    });

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
            hostName: house.createdUser ? `${house.createdUser.firstName} ${house.createdUser.lastName}` : house.createdByName,
            hostAvatar: house.createdUser?.profilePictureUrl || house.createdByPhotoUrl,
            createdById: house.createdById,
            createdUser: house.createdUser,
            isFavorite: house.isFavorite,
            ratings: house.ratings,
            lat: house.latitude,
            lng: house.longitude,
        };
    };

    return <AccommodationDetailTemplate isLoading={isLoading} accommodation={mapHouseToAccommodation(house)} />;
};

export default AccommodationDetail;
