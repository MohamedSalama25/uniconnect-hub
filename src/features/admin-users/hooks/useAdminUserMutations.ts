import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersService } from "../services/admin-users.service";
import { useToast } from "@/components/ui/use-toast";

export const useAdminUserMutations = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const onSuccess = (message: string) => {
        toast({ title: "نجاح", description: message });
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
        queryClient.invalidateQueries({ queryKey: ["house"] });
        queryClient.invalidateQueries({ queryKey: ["admin-houses"] });
        queryClient.invalidateQueries({ queryKey: ["house-detail"] });
    };

    const onError = (error: any) => {
        toast({
            title: "خطأ",
            description: error.response?.data?.message || "حدث خطأ ما، يرجى المحاولة لاحقاً",
            variant: "destructive",
        });
    };

    const acceptUserMutation = useMutation({
        mutationFn: (userId: string) => adminUsersService.acceptUser(userId),
        onSuccess: () => onSuccess("تم قبول المستخدم بنجاح"),
        onError: () => onError({ response: { data: { message: "فشل في قبول المستخدم" } } }),
    });

    const blockUserMutation = useMutation({
        mutationFn: ({ userId, isBlocked }: { userId: string; isBlocked: boolean }) =>
            adminUsersService.blockUser(userId, isBlocked),
        onSuccess: (_, { isBlocked }) => onSuccess(isBlocked ? "تم حظر المستخدم بنجاح" : "تم فك الحظر عن المستخدم بنجاح"),
        onError: () => onError({ response: { data: { message: "فشل في تحديث حالة الحظر" } } }),
    });

    const assignRoleMutation = useMutation({
        mutationFn: ({ username, role }: { username: string; role: string }) =>
            adminUsersService.assignRole(username, role),
        onSuccess: (_, { role }) => onSuccess(`تم تعيين دور ${role} بنجاح`),
        onError: () => onError({ response: { data: { message: "فشل في تعيين الدور" } } }),
    });

    const removeRoleMutation = useMutation({
        mutationFn: ({ username, role }: { username: string; role: string }) =>
            adminUsersService.removeRole(username, role),
        onSuccess: (_, { role }) => onSuccess(`تم إزالة دور ${role} بنجاح`),
        onError: () => onError({ response: { data: { message: "فشل في إزالة الدور" } } }),
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
