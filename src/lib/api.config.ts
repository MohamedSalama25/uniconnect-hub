export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || "https://4mrkc8vc-7012.uks1.devtunnels.ms/",
    ENDPOINTS: {
        ACCOUNTS: {
            LOGIN: "/api/Accounts/login",
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
        },
    },
};
