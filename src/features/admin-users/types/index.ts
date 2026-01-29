export interface UserDto {
    id: string;
    email: string;
    username: string;
    phoneNumber: string;
    phonenumber?: string; // Resilience for backend casing
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    birthAddress: string;
    currentAddress: string;
    profilePictureUrl: string;
    universityName: string;
    collegeName: string;
    academicYear: number;
    isAccepted: boolean;
    isAcceptedDate: string | null;
    isBlocked: boolean;
    introductionNote: string;
    roles: string[];
    cardPictureUrl?: string;
    houseCount?: number;
    acceptedHouseCount?: number;
    notAcceptedHouseCount?: number;
    houseRatingCount?: number;
    houseAverageRating?: number;
    helpRequestCount?: number;
    helpRequestAccepted?: number;
    servicesCount?: number;
    servicesAccepted?: number;
    servicesNotAccepted?: number;
    servicesRatingCount?: number;
    servicesAverageRating?: number;
}

export interface UserPostsResponse {
    pageSize: number;
    pageIndex: number;
    count: number;
    data: {
        readHouses: any[]; // Avoid circular dependency by using any or specific partial types
        readHelpRequests: any[];
        readServices: any[];
    }[];
}

export interface UserQueryParams {
    pageSize?: number;
    pageIndex?: number;
    SearchByNameOrEmail?: string;
    University?: string;
    College?: string;
    AcademicYear?: number;
    IsAccepted?: boolean;
    IsBlocked?: boolean;
    Role?: string;
    Sort?: string;
}

export interface UsersPageResponse {
    users: {
        pageSize: number;
        pageIndex: number;
        count: number;
        data: UserDto[];
    };
    totalUsers: number;
    acceptedUsers: number;
    blockedUsers: number;
    pendingUsers: number;
}

export interface UserActionResponse {
    statusCode: number;
    message: string;
}
