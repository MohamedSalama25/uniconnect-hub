import clientAxios from '@/lib/axios';
import { API_CONFIG } from '@/lib/api.config';

export interface UserPostsResponse {
    pageSize: number;
    pageIndex: number;
    count: number;
    data: {
        readHouses: House[];
        readHelpRequests: HelpRequest[];
        readServices: Service[];
    }[];
}

// Reuse existing types or define subsets if full types aren't available globally yet
// Ideally, we import these from their feature folders/types, but I'll define essential interfaces here to match the JSON response 
// and avoid circular deps if types are not centralized.

export interface House {
    id: number;
    name: string;
    address: string;
    description: string;
    price: number;
    numberOfRooms: number;
    numberOfBathrooms: number;
    typeId: number;
    typeName: string;
    imageUrls: string[];
    facilityNames: string[];
    averageRating: number;
    isFavorite: boolean;
    createdUser: UserInfo;
    createdAt: string;
}

export interface HelpRequest {
    id: number;
    title: string;
    description: string;
    status: string;
    helpRequestTypeId: number;
    helpRequestTypeName: string;
    createdUser: UserInfo;
    createdAt: string;
}

export interface Service {
    id: number;
    name: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
    workingFrom: any;
    workingTo: any;
    status: string;
    serviceCategoryId: number;
    serviceCategoryName: string;
    createdUser: UserInfo;
    createdAt: string;
    // ... add other fields as needed for display
}

export interface UserInfo {
    id: string;
    email: string;
    username: string;
    phonenumber: string;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
    universityName: string;
    collegeName: string;
    academicYear: number;
    introductionNote: string;
    isAccepted: boolean;
    isAcceptedDate?: string;
    // ... counts and ratings
    houseCount: number;
    servicesCount: number;
    helpRequestCount: number;
    houseAverageRating: number;
    servicesAverageRating: number;
}

export const userService = {
    getUserPosts: async (userId: string) => {
        const response = await clientAxios.get<UserPostsResponse>(API_CONFIG.ENDPOINTS.USERS.GET_USER_POSTS(userId));
        return response.data;
    }
};
