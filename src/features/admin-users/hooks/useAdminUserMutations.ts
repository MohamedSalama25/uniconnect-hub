import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersService } from "../services/admin-users.service";
import { useToast } from "@/components/ui/use-toast";

export const useAdminUserMutations = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const onSuccess = (message: string) => {
        toast({ title: "Success", description: message });
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    };

    const onError = (error: any) => {
        toast({
            title: "Error",
            description: error.response?.data?.message || "Action failed",
            variant: "destructive",
        });
    };

    const acceptUserMutation = useMutation({
        mutationFn: (userId: string) => adminUsersService.acceptUser(userId),
        onSuccess: () => onSuccess("User accepted successfully"),
        onError,
    });

    const blockUserMutation = useMutation({
        mutationFn: (userId: string) => adminUsersService.blockUser(userId),
        onSuccess: () => onSuccess("User block status updated"),
        onError,
    });

    const assignRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) => 
            adminUsersService.assignRole(userId, role),
        onSuccess: (_, { role }) => onSuccess(`Role ${role} assigned successfully`),
        onError,
    });

    const removeRoleMutation = useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) => 
            adminUsersService.removeRole(userId, role),
        onSuccess: (_, { role }) => onSuccess(`Role ${role} removed successfully`),
        onError,
    });

    return {
        acceptUser: acceptUserMutation.mutate,
        blockUser: blockUserMutation.mutate,
        assignRole: assignRoleMutation.mutate,
        removeRole: removeRoleMutation.mutate,
        isPending: 
            acceptUserMutation.isPending || 
            blockUserMutation.isPending || 
            assignRoleMutation.isPending || 
            removeRoleMutation.isPending
    };
};
