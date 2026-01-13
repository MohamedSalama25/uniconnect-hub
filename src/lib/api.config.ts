export const API_CONFIG = {
    BASE_URL: localStorage.getItem("baseUrl") || "", // Empty string means it will use the same origin (Vite proxy)
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
    },
};
