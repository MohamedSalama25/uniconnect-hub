import { UserProfileDialog } from "@/features/profile/components/UserProfileDialog";
import { UserDto } from "@/features/admin-users/types";

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    // These props are kept for backward compatibility but might be unused if UserProfileDialog fetches everything
    userName: string;
    userAvatar?: string;
    userId?: string;
    user?: UserDto;
}

export function UserProfileModal({ isOpen, onClose, userId, user }: UserProfileModalProps) {
    const effectiveUserId = userId || user?.id;

    if (!effectiveUserId) return null;

    return (
        <UserProfileDialog
            userId={effectiveUserId}
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
        />
    );
}
