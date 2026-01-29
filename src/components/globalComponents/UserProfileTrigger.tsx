import { useState } from "react";
import { UserProfileModal } from "./UserProfileModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDto } from "@/features/admin-users/types";

interface UserProfileTriggerProps {
    name: string;
    avatar?: string;
    userId?: string;
    user?: UserDto;
    children?: React.ReactNode;
    className?: string;
}

export const UserProfileTrigger = ({ name, avatar, userId, user, children, className }: UserProfileTriggerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent bubbling if inside another clickable
        e.preventDefault();
        setIsOpen(true);
    };

    return (
        <>
            <div onClick={handleClick} className={`cursor-pointer ${className || ''}`}>
                {children ? (
                    children
                ) : (
                    <div className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={avatar} alt={name} />
                            <AvatarFallback>{name?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm">{name}</span>
                    </div>
                )}
            </div>

            <UserProfileModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                userName={name}
                userAvatar={avatar}
                userId={userId}
                user={user}
            />
        </>
    );
};
