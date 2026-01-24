import { UserDto } from "@/features/admin-users/types";

export interface Rating {
  id: number;
  houseId: number;
  houseName: string;
  userId: string;
  userName: string;
  userPhotoUrl: string;
  stars: number;
  comment: string;
  ratedOn: string;
  isPublished: boolean;
}

export interface House {
  id: number;
  name: string;
  address: string;
  description: string;
  price: number;
  latitude: number;
  longitude: number;
  numberOfRooms: number;
  numberOfBathrooms: number;
  typeId: number;
  typeName: string;
  isAvailable: boolean;
  availableFrom: string;
  isAccepted: boolean;
  facilityNames: string[];
  imageUrls: string[];
  createdById: string;
  createdAt: string;
  createdByName: string;
  createdUser: UserDto;
  createdByPhotoUrl: string;
  updatedById: string;
  updatedAt: string;
  updatedByName: string;
  updatedByPhotoUrl: string;
  ratings: Rating[];
  averageRating: number;
  isFavorite: boolean;
}

export interface CreateHouseRequest {
  Name: string;
  Address: string;
  Description: string;
  Price: number;
  NumberOfRooms: number;
  NumberOfBathrooms: number;
  TypeId: number;
  IsAvailable: boolean;
  AvailableFrom: string;
  Facilities: string[];
  Images: (File | string)[]; // Consolidated: can be new Files or existing URLs
  Latitude?: number;
  Longitude?: number;
}

export type CreateHouseResponse = House & {
  statusCode?: number;
  message?: string;
};

export interface PaginatedHouses {
  pageSize: number;
  pageIndex: number;
  count: number;
  data: House[];
}

export interface HousingFilterParams {
  Search?: string;
  sort?: string;
  TypeId?: number;
  pageSize?: number;
  pageIndex?: number;
}
