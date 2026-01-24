import { API_CONFIG } from "@/lib/api.config";
import clientAxios from "@/lib/axios";


export interface RegisterResponse {
    email: string;
    displayName: string;
    message: string;
}

export const authService = {
    registerAsStudent: async (formData: FormData, queryParams: Record<string, string>, studentCard?: File): Promise<RegisterResponse> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.REGISTER_STUDENT;
        
        if (studentCard) {
            formData.append('StudentCardID', studentCard);
        }

        const response = await clientAxios.post(url, formData, {
            params: queryParams
        });

        return response.data;
    },

    registerAsService: async (formData: FormData, queryParams: Record<string, string>, serviceCard?: File): Promise<RegisterResponse> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.REGISTER_SERVICE;

        if (serviceCard) {
            formData.append('ServiceCardID', serviceCard);
        }

        const response = await clientAxios.post(url, formData, {
            params: queryParams
        });

        return response.data;
    },

    login: async (credentials: { emailORUsername: string; password: string }): Promise<any> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.LOGIN;
        const response = await clientAxios.post(url, credentials);
        return response.data; // The server returns { success, message, data: { ... } }
    },

    logout: async (): Promise<void> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.LOGOUT;
        await clientAxios.post(url);
    },

    refreshToken: async (): Promise<any> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.REFRESH_TOKEN;
        const response = await clientAxios.post(url);
        return response.data;
    },

    getCurrentUser: async (token: string): Promise<any> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.GET_CURRENT_USER;
        const response = await clientAxios.get(url);
        return response.data;
    },

    updateCurrentUser: async (token: string, data: any, file?: File): Promise<any> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.UPDATE_CURRENT_USER;
        
        // Prepare params
        const params = new URLSearchParams();
        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                params.append(key, data[key]);
            }
        });

        // Prepare body
        let body: any = null;
        if (file) {
            const formData = new FormData();
            formData.append('ProfilePicture', file);
            body = formData;
        }

        const response = await clientAxios.put(url, body, {
            params: params,
            // Axios handles Content-Type for FormData automatically
        });

        return response.data;
    },

    updateProfilePicture: async (token: string, file: File): Promise<any> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.UPDATE_CURRENT_USER;
        const formData = new FormData();
        formData.append('ProfilePicture', file);

        const response = await clientAxios.put(url, formData);
        return response.data;
    },

    resetPassword: async (data: { emailORUsername: string; token: string; newPassword: string }): Promise<any> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.RESET_PASSWORD;
        const response = await clientAxios.post(url, data);
        return response.data;
    },

    forgetPassword: async (email: string): Promise<any> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.FORGET_PASSWORD;
        const response = await clientAxios.post(url, null, {
            params: { email }
        });
        return response.data;
    },

    changePassword: async (token: string, data: { currentPassword: string; newPassword: string }): Promise<any> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.CHANGE_PASSWORD;
        const response = await clientAxios.post(url, data);
        return response.data;
    },

    sendOTP: async (email: string): Promise<any> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.SEND_OTP;
        const response = await clientAxios.post(url, null, {
            params: { email, operation: "register" }
        });
        return response.data;
    },

    verifyOTP: async (email: string, otp: string): Promise<any> => {
        const url = API_CONFIG.ENDPOINTS.ACCOUNTS.VERIFY_OTP;
        const response = await clientAxios.post(url, { email, otp });
        return response.data;
    }
};
