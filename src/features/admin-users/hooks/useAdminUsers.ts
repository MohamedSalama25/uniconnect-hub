import { useQuery } from "@tanstack/react-query";
import { adminUsersService } from "../services/admin-users.service";
import { UserQueryParams } from "../types";

export const useAdminUsers = (params: UserQueryParams) => {
    return useQuery({
        queryKey: ["admin-users", params],
        queryFn: () => adminUsersService.getAllUsers(params),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
    });
};
