import { Edit, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RatingStars } from '@/components/cards/RatingStars';
import type { currentStudent } from '@/data/mockData';

interface ProfileHeaderProps {
    user: typeof currentStudent;
}

export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    return (
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            {/* Cover */}
            <div className="h-32 gradient-primary" />

            {/* Profile Info */}
            <div className="px-6 pb-6">
                <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
                    <Avatar className="w-24 h-24 border-4 border-card shadow-lg">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 md:mb-2 text-right">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <div className="flex items-center gap-2 mt-1 justify-end">
                            <RatingStars rating={user.rating} size="sm" />
                            <span className="text-sm text-muted-foreground">• طالب نشط</span>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" className="btn-hover">
                            <Edit className="w-4 h-4 ml-2" />
                            تعديل الملف
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-xl">
                            <Settings className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
