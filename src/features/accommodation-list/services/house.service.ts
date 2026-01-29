import clientAxios from '@/lib/axios';
import { CreateHouseRequest, CreateHouseResponse, House } from '../types/house.types';
import { formatImageUrl } from '@/lib/utils';
import { API_CONFIG } from '@/lib/api.config';

const mapHouseImages = (house: House): House => ({
  ...house,
  imageUrls: house.imageUrls?.map(url => formatImageUrl(url) || url),
  createdByPhotoUrl: formatImageUrl(house.createdByPhotoUrl) || house.createdByPhotoUrl,
  updatedByPhotoUrl: formatImageUrl(house.updatedByPhotoUrl) || house.updatedByPhotoUrl,
  ratings: house.ratings?.map(rating => ({
    ...rating,
    userPhotoUrl: formatImageUrl(rating.userPhotoUrl) || rating.userPhotoUrl
  }))
});

export const houseService = {
  createHouse: async (data: CreateHouseRequest): Promise<CreateHouseResponse> => {
    const formData = new FormData();

    // Append simple fields
    formData.append('Name', data.Name);
    formData.append('Address', data.Address);
    formData.append('Description', data.Description);
    formData.append('Price', data.Price.toString());
    formData.append('NumberOfRooms', data.NumberOfRooms.toString());
    formData.append('NumberOfBathrooms', data.NumberOfBathrooms.toString());
    formData.append('TypeId', data.TypeId.toString());
    formData.append('IsAvailable', data.IsAvailable.toString());
    formData.append('AvailableFrom', data.AvailableFrom);

    if (data.Latitude !== undefined) formData.append('Latitude', data.Latitude.toString());
    if (data.Longitude !== undefined) formData.append('Longitude', data.Longitude.toString());

    // Append facilities (array)
    if (data.Facilities && data.Facilities.length > 0) {
      data.Facilities.forEach((facility) => {
        formData.append('Facilities', facility);
      });
    }

    // Append images (array of Files)
    if (data.Images && data.Images.length > 0) {
      data.Images.forEach((image) => {
        formData.append('Images', image);
      });
    }

    const response = await clientAxios.post<CreateHouseResponse>('/api/House', formData);
    return mapHouseImages(response.data) as CreateHouseResponse;
  },

  // Public Methods
  getAllHouses: async (params?: import('../types/house.types').HousingFilterParams): Promise<import('../types/house.types').PaginatedHouses> => {
    const response = await clientAxios.get<any>(API_CONFIG.ENDPOINTS.HOUSE.GET_ALL, {
      params
    });

    // Handle new wrapped response structure: { data: { pageSize, data, ... }, statistics: { ... } }
    const body = response.data;
    const paginatedData = body?.data || body;
    const stats = body?.statistics;

    return {
      ...paginatedData,
      data: (paginatedData.data || []).map(mapHouseImages),
      // Map new statistics structure to expected format
      totalHouses: stats?.total ?? paginatedData?.totalHouses ?? 0,
      pendingHouses: stats?.pendingTotal ?? paginatedData?.pendingHouses ?? 0,
      acceptedHouses: stats?.acceptedTotal ?? paginatedData?.acceptedHouses ?? 0,
      rejectedHouses: stats?.rejectedTotal ?? paginatedData?.rejectedHouses ?? 0,
    };
  },

  getPublicHouseById: async (id: number): Promise<House> => {
    const response = await clientAxios.get<any>(API_CONFIG.ENDPOINTS.HOUSE.GET_BY_ID(id));
    // Handle potential { data: House } or just House structure
    const house = response.data?.data || response.data;
    return mapHouseImages(house);
  },

  // Dashboard Methods (Admin/Provider)
  getHouses: async (params?: import('../types/house.types').HousingFilterParams): Promise<import('../types/house.types').PaginatedHouses> => {
    const response = await clientAxios.get<any>(API_CONFIG.ENDPOINTS.HOUSE.DASHBOARD_HOUSES, {
      params
    });

    // Handle new wrapped response structure: { data: { pageSize, data, ... }, statistics: { ... } }
    const body = response.data;
    const paginatedData = body?.data || body;
    const stats = body?.statistics;

    return {
      ...paginatedData,
      data: (paginatedData.data || []).map(mapHouseImages),
      // Map new statistics structure to expected format
      totalHouses: stats?.total ?? paginatedData?.totalHouses ?? 0,
      pendingHouses: stats?.pendingTotal ?? paginatedData?.pendingHouses ?? 0,
      acceptedHouses: stats?.acceptedTotal ?? paginatedData?.acceptedHouses ?? 0,
      rejectedHouses: stats?.rejectedTotal ?? paginatedData?.rejectedHouses ?? 0,
    };
  },

  getHouseById: async (id: number): Promise<House> => {
    const response = await clientAxios.get<any>(API_CONFIG.ENDPOINTS.HOUSE.DASHBOARD_HOUSE_BY_ID(id));
    // Handle potential { data: House } or just House structure
    const house = response.data?.data || response.data;
    return mapHouseImages(house);
  },

  acceptHouse: async (id: number, status: import('../types/house.types').HouseStatus): Promise<House> => {
    const response = await clientAxios.patch<House>(API_CONFIG.ENDPOINTS.HOUSE.ACCEPT(id), status);
    return mapHouseImages(response.data);
  },

  toggleFavorite: async (id: number): Promise<any> => {
    const response = await clientAxios.post(API_CONFIG.ENDPOINTS.HOUSE.TOGGLE_FAVORITE(id));
    return response.data;
  },

  getFavorites: async (): Promise<House[]> => {
    const response = await clientAxios.get<any>(API_CONFIG.ENDPOINTS.HOUSE.GET_FAVORITES);
    const body = response.data;
    let results = [];

    if (Array.isArray(body)) {
      results = body;
    } else if (body && Array.isArray(body.data)) {
      results = body.data;
    } else if (body && body.data && Array.isArray(body.data.data)) {
      results = body.data.data;
    } else if (body && typeof body === 'object' && (body.id || body.success === false)) {
      // If singular object or failed response
      results = body.id ? [body] : [];
    }

    return results.map(mapHouseImages);
  },

  deleteHouse: async (id: number): Promise<void> => {
    await clientAxios.delete(API_CONFIG.ENDPOINTS.HOUSE.DELETE(id));
  },

  deleteHouseImage: async (houseId: number, imageUrl: string): Promise<void> => {
    await clientAxios.delete(API_CONFIG.ENDPOINTS.HOUSE.DELETE_IMAGE(houseId), {
      params: { houseId, imageUrl }
    });
  },

  updateHouse: async (id: number, data: CreateHouseRequest): Promise<House> => {
    const formData = new FormData();
    formData.append('Name', data.Name);
    formData.append('Address', data.Address);
    formData.append('Description', data.Description);
    formData.append('Price', data.Price.toString());
    formData.append('NumberOfRooms', data.NumberOfRooms.toString());
    formData.append('NumberOfBathrooms', data.NumberOfBathrooms.toString());
    formData.append('TypeId', data.TypeId.toString());
    formData.append('IsAvailable', data.IsAvailable.toString());
    formData.append('AvailableFrom', data.AvailableFrom);

    if (data.Latitude !== undefined) formData.append('Latitude', data.Latitude.toString());
    if (data.Longitude !== undefined) formData.append('Longitude', data.Longitude.toString());

    if (data.Facilities && data.Facilities.length > 0) {
      data.Facilities.forEach((facility) => {
        formData.append('Facilities', facility);
      });
    }
    if (data.Images && data.Images.length > 0) {
      data.Images.forEach((image) => {
        // Each item can be a File (new) or a string (existing URL)
        formData.append('Images', image);
      });
    }

    const response = await clientAxios.put<House>(API_CONFIG.ENDPOINTS.HOUSE.UPDATE(id), formData);
    return mapHouseImages(response.data);
  },

  // Rating Methods
  addRating: async (data: { houseId: number; stars: number; comment: string }): Promise<any> => {
    const response = await clientAxios.post(API_CONFIG.ENDPOINTS.HOUSE.ADD_RATING, data);
    return response.data;
  },

  deleteRating: async (ratingId: number): Promise<void> => {
    await clientAxios.delete(API_CONFIG.ENDPOINTS.HOUSE.DELETE_RATING(ratingId));
  },

  getAdminRatings: async (): Promise<import('../types/house.types').Rating[]> => {
    const response = await clientAxios.get<{ success: boolean, data: import('../types/house.types').Rating[] }>(API_CONFIG.ENDPOINTS.HOUSE.GET_ADMIN_RATINGS);
    return response.data.data.map(rating => ({
      ...rating,
      userPhotoUrl: formatImageUrl(rating.userPhotoUrl) || rating.userPhotoUrl
    }));
  },

  togglePublishRating: async (ratingId: number, isPublished: boolean): Promise<any> => {
    const response = await clientAxios.patch(API_CONFIG.ENDPOINTS.HOUSE.PUBLISH_RATING(ratingId), null, {
      params: { isPublished }
    });
    return response.data;
  }
};
