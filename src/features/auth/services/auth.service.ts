import { API_CONFIG } from "@/lib/api.config";

export interface RegisterResponse {
    email: string;
    displayName: string;
    message: string;
}

export const authService = {
    registerAsStudent: async (formData: FormData, queryParams: Record<string, string>, studentCard?: File): Promise<RegisterResponse> => {
        const url = new URL(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS.REGISTER_STUDENT}`);
        Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

        if (studentCard) {
            formData.append('StudentCardID', studentCard);
        }

        const response = await fetch(url.toString(), {
            method: 'POST',
            body: formData, // Contains ProfilePicture and optionally StudentCardID
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to register as student');
        }

        return response.json();
    },

    registerAsService: async (formData: FormData, queryParams: Record<string, string>, serviceCard?: File): Promise<RegisterResponse> => {
        const url = new URL(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS.REGISTER_SERVICE}`);
        Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

        if (serviceCard) {
            formData.append('ServiceCardID', serviceCard);
        }

        const response = await fetch(url.toString(), {
            method: 'POST',
            body: formData, // Contains ProfilePicture and optionally ServiceCardID
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to register as service provider');
        }

        return response.json();
    },

    login: async (credentials: { emailORUsername: string; password: string }): Promise<RegisterResponse & { token: string; roles: string[] }> => {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS.LOGIN}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to login');
        }

        return response.json();
    },

    getCurrentUser: async (token: string): Promise<any> => {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS.GET_CURRENT_USER}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch current user');
        }

        return response.json();
    },

    updateCurrentUser: async (token: string, data: any, file?: File): Promise<any> => {
        const url = new URL(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS.UPDATE_CURRENT_USER}`);

        // If it's just data, we use query params as before (compatibility)
        // If there's a file, we should probably use FormData for everything or keep query params?
        // Let's stick to the existing query param pattern for data and add FormData for the file if present.

        Object.keys(data).forEach(key => {
            if (data[key] !== undefined && data[key] !== null) {
                url.searchParams.append(key, data[key]);
            }
        });

        const options: RequestInit = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };

        if (file) {
            const formData = new FormData();
            formData.append('ProfilePicture', file);
            options.body = formData;
            // Note: Don't set Content-Type header when using FormData, let the browser do it with the boundary
        }

        const response = await fetch(url.toString(), options);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
        }

        return response.json();
    },

    updateProfilePicture: async (token: string, file: File): Promise<any> => {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS.UPDATE_CURRENT_USER}`;
        const formData = new FormData();
        formData.append('ProfilePicture', file);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile picture');
        }

        return response.json();
    },

    resetPassword: async (data: { emailORUsername: string; token: string; newPassword: string }): Promise<any> => {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS.RESET_PASSWORD}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to reset password');
        }

        return response.json();
    },

    changePassword: async (token: string, data: { currentPassword: string; newPassword: string }): Promise<any> => {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS.CHANGE_PASSWORD}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to change password');
        }

        return response.json();
    },

    sendOTP: async (email: string): Promise<any> => {
        const url = new URL(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS.SEND_OTP}`);
        url.searchParams.append('email', email);

        const response = await fetch(url.toString(), {
            method: 'POST',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send OTP');
        }

        return response.json();
    },

    verifyOTP: async (email: string, otp: string): Promise<any> => {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ACCOUNTS.VERIFY_OTP}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to verify OTP');
        }

        return response.json();
    }
};
