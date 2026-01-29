import { House } from "@/features/accommodation-list/types/house.types";
import { Service } from "@/features/services/types/service.types";
import { HelpRequest } from "@/features/help/types/help-request.types";

export interface MainPageData {
    readHouse: House[];
    readServices: Service[];
    readHelps: HelpRequest[];
    acceptedHouses: number;
    acceptedHelpRequests: number;
    acceptedServices: number;
}
