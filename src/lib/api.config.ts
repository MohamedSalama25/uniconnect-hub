export const API_CONFIG = {
    BASE_URL: localStorage.getItem("baseUrl") ||import.meta.env.VITE_API_BASE_URL ||  "", 
    ENDPOINTS: {
        ACCOUNTS: {
            LOGIN: "/api/Accounts/login",
            LOGOUT: "/api/Accounts/logout",
            REGISTER_STUDENT: "/api/Accounts/registerAsStudent",
            REGISTER_SERVICE: "/api/Accounts/registerAsService",
            GET_CURRENT_USER: "/api/Accounts/getCurrentUser",
            UPDATE_CURRENT_USER: "/api/Accounts/updateCurrentUser",
            ASSIGN_ROLE: "/api/Accounts/assignRole",
            REMOVE_ROLE: "/api/Accounts/removeRole",
            FORGET_PASSWORD: "/api/Accounts/forgetPassword",
            RESET_PASSWORD: "/api/Accounts/resetPassword",
            CHANGE_PASSWORD: "/api/Accounts/changePassword",
            SEND_OTP: "/api/Accounts/sendOTP",
            VERIFY_OTP: "/api/Accounts/verifyOTP",
            REFRESH_TOKEN: "/api/Accounts/refreshToken",
        },
        USERS: {
            GET_ALL: "/api/Users/users",
            ASSIGN_ROLE: "/api/Users/assignRole",
            REMOVE_ROLE: "/api/Users/removeRole",
            ACCEPT: (userId: string) => `/api/Users/${userId}/accept`,
            BLOCK: (userId: string) => `/api/Users/${userId}/block`,
        },
        CHAT: {
             CONVERSATIONS: "/api/Chat/conversations",
             MESSAGES: (conversationId: number) => `/api/Chat/messages/${conversationId}`,
             MARK_READ: (conversationId: number) => `/api/Chat/markAsRead/${conversationId}`,
             ONLINE: (userId: string) => `/api/Chat/online/${userId}`, // NoteBased on screenshot, seems to be a GET status check
        },
        HOUSE: {
            GET_ALL: "/api/House/Houses",
            GET_BY_ID: (id: number) => `/api/House/${id}`,
            DASHBOARD_HOUSES: "/api/House/dashboard/Houses",
            DASHBOARD_HOUSE_BY_ID: (id: number) => `/api/House/dashboard/${id}`,
            ACCEPT: (id: number) => `/api/House/${id}/accept`,
            TOGGLE_FAVORITE: (id: number) => `/api/House/favorite/${id}`,
        }
    },
    SIGNALR_HUB_URL: "/hubs/chat", // Adjust path as needed, typically hub route
};
