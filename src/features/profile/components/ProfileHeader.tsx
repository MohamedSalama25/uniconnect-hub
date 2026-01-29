import { Edit, Settings, Camera, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RatingStars } from '@/components/cards/RatingStars';
import { formatImageUrl } from '@/lib/utils';
import { useImageViewerStore } from '@/store/useImageViewerStore';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRef, useState } from 'react';
import { authService } from '@/features/auth/services/auth.service';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

interface ProfileHeaderProps {
    user: any;
    onEditClick: () => void;
}

export const ProfileHeader = ({ user, onEditClick }: ProfileHeaderProps) => {
    const openImageViewer = useImageViewerStore(state => state.open);
    const { user: authUser, setUserDetails, refreshProfileUI, profileUpdateTick } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fullName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : (user?.displayName || user?.name || "مستخدم");

    // Use global profileUpdateTick for cache busting
    const profilePicUrl = formatImageUrl(user?.profilePictureUrl);
    const avatarSrc = profilePicUrl ? `${profilePicUrl}?t=${profileUpdateTick}` : undefined;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        const token = authUser?.token;
        if (!file || !token) return;

        setIsUpdating(true);
        const toastId = toast.loading("جاري تحديث الصورة الشخصية...");

        try {
            // Use updateCurrentUser as requested by the user
            const updatedProfile = await authService.updateCurrentUser(token, {}, file);

            setUserDetails(updatedProfile);
            refreshProfileUI(); // Trigger global UI update
            toast.success("تم تحديث الصورة الشخصية بنجاح", { id: toastId });
        } catch (error: any) {
            toast.error(error.message || "فشل تحديث الصورة", { id: toastId });
        } finally {
            setIsUpdating(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Cover */}
            <div className="h-48 gradient-primary" />

            {/* Profile Info */}
            <div className="px-6 pb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12">
                    <div className="relative group/avatar">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="relative cursor-pointer ring-4 ring-card rounded-full overflow-hidden shadow-md transition-transform hover:scale-[1.05] active:scale-[0.95]">
                                    <Avatar className="w-24 h-24 rounded-full">
                                        <AvatarImage
                                            src={avatarSrc}
                                            alt={fullName}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="text-3xl rounded-full bg-secondary">{fullName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 flex items-center justify-center">
                                        <Camera className="w-8 h-8 text-white drop-shadow-lg" />
                                    </div>
                                    {isUpdating && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                                            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56 p-2 rounded-2xl shadow-xl border-border/50 backdrop-blur-sm">
                                <DropdownMenuItem
                                    className="gap-3 py-3 rounded-xl cursor-pointer"
                                    onClick={() => avatarSrc && openImageViewer(avatarSrc)}
                                >
                                    <Eye className="w-4 h-4 text-primary" />
                                    <span className="font-bold">عرض الصورة</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="gap-3 py-3 rounded-xl cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="w-4 h-4 text-success" />
                                    <span className="font-bold">تحديث الصورة</span>
                                </DropdownMenuItem>
                                <div className="h-px bg-border my-1 mx-1" />
                                <DropdownMenuItem className="gap-3 py-3 rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                                    <Trash2 className="w-4 h-4" />
                                    <span className="font-bold">إزالة الصورة</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex-1 md:mb-4 text-right">
                        <h1 className="text-3xl font-black text-foreground drop-shadow-sm">{fullName}</h1>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 font-medium text-muted-foreground">
                            {user?.roles?.includes('Student') && (
                                <span>طالب في {user?.universityName || 'الجامعة'} •</span>
                            )}
                            {(user?.roles?.includes('Provider') || user?.roles?.includes('Service')) && (() => {
                                const hAvg = user?.houseAverageRating || 0;
                                const hCount = user?.houseRatingCount || 0;
                                const sAvg = user?.servicesAverageRating || 0;
                                const sCount = user?.servicesRatingCount || 0;
                                const totalCount = hCount + sCount;
                                const weightedRating = totalCount > 0
                                    ? ((hAvg * hCount) + (sAvg * sCount)) / totalCount
                                    : 0;

                                return (
                                    <div className="flex items-center gap-2">
                                        <RatingStars rating={weightedRating} size="sm" />
                                        <span className="text-foreground/80 font-bold">
                                            ({weightedRating.toFixed(1)})
                                        </span>
                                        <span>•</span>
                                    </div>
                                );
                            })()}
                            <span>عضو منذ {user?.isAcceptedDate ? new Date(user.isAcceptedDate).getFullYear() : '2026'}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 h-fit md:mb-4">
                        <Button onClick={onEditClick} variant="outline" className="h-12 px-6 rounded-2xl gap-2 font-bold border-2 hover:bg-secondary transition-all shadow-sm">
                            <Edit className="w-4 h-4" />
                            تعديل الملف
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
