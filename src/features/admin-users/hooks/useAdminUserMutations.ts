import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminUsersService } from "../services/admin-users.service";
import { notificationService } from "@/features/notifications/services/notification.service";
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
        mutationFn: (userId: string) => adminUsersService.acceptUser(userId, true),
        onSuccess: (_, userId) => {
            onSuccess("تم قبول المستخدم بنجاح");
            notificationService.sendNotification({
                userId,
                title: "تم قبول حسابك",
                message: "تهانينا! تم قبول طلب تسجيلك. يمكنك الآن استخدام كافة مميزات المنصة."
            });
        },
        onError: () => onError({ response: { data: { message: "فشل في قبول المستخدم" } } }),
    });

    const blockUserMutation = useMutation({
        mutationFn: ({ userId, isBlocked }: { userId: string; isBlocked: boolean }) =>
            adminUsersService.blockUser(userId, isBlocked),
        onSuccess: (_, { isBlocked, userId }) => {
            onSuccess(isBlocked ? "تم حظر المستخدم بنجاح" : "تم فك الحظر عن المستخدم بنجاح");
            notificationService.sendNotification({
                userId,
                title: isBlocked ? "تم حظر حسابك" : "تم فك الحظر عن حسابك",
                message: isBlocked
                    ? "تم حظر حسابك لمخالفة القوانين. يرجى التواصل مع الدعم الفني."
                    : "تم فك الحظر عن حسابك. يمكنك الآن استخدام المنصة مرة أخرى."
            });
        },
        onError: () => onError({ response: { data: { message: "فشل في تحديث حالة الحظر" } } }),
    });

    const assignRoleMutation = useMutation({
        mutationFn: ({ username, role }: { userId: string; username: string; role: string }) =>
            adminUsersService.assignRole(username, role),
        onSuccess: (_, { role, userId }) => {
            onSuccess(`تم تعيين دور ${role} بنجاح`);
            notificationService.sendNotification({
                userId,
                title: "تم تحديث الصلاحيات",
                message: `تم منحك صلاحيات جديدة: ${role}.`
            });
        },
        onError: () => onError({ response: { data: { message: "فشل في تعيين الدور" } } }),
    });

    const removeRoleMutation = useMutation({
        mutationFn: ({ username, role }: { userId: string; username: string; role: string }) =>
            adminUsersService.removeRole(username, role),
        onSuccess: (_, { role, userId }) => {
            onSuccess(`تم إزالة دور ${role} بنجاح`);
            notificationService.sendNotification({
                userId,
                title: "تم تحديث الصلاحيات",
                message: `تم إزالة صلاحيات: ${role} من حسابك.`
            });
        },
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
