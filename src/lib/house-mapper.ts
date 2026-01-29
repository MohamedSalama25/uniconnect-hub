import { House } from "@/features/accommodation-list/types/house.types";
import { Accommodation } from "@/data/mockData";

export const mapHouseToAccommodation = (house: House): Accommodation => ({
    id: house.id.toString(),
    title: house.name,
    image: house.imageUrls?.[0] || "",
    images: house.imageUrls || [],
    price: house.price,
    distance: 0,
    type: house.typeName?.toLowerCase().includes('shared') ? 'shared' : 'private',
    rating: house.averageRating || 0,
    location: house.address,
    bedrooms: house.numberOfRooms || 0,
    bathrooms: house.numberOfBathrooms || 0,
    amenities: house.facilityNames || [],
    description: house.description || "",
    hostName: house.createdByName || house.createdUser?.username || "غير معروف",
    hostAvatar: house.createdByPhotoUrl || house.createdUser?.profilePictureUrl || "",
    createdById: house.createdById || house.createdUser?.id,
    isFavorite: house.isFavorite,
});
