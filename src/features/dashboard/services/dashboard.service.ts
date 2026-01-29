import axios from "axios";
import { API_CONFIG } from "@/lib/api.config";
import { MainPageData } from "../types/dashboard.types";

export const dashboardService = {
    getMainPageData: async (): Promise<MainPageData> => {
        const response = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PAGES.MAIN_PAGE}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    },
};
