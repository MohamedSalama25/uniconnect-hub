import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { currentStudent, accommodations } from '@/data/mockData';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileInfoCards } from '../components/ProfileInfoCards';
import { ProfileTabs } from '../components/ProfileTabs';
import { CreatePostDialog } from '@/components/globalComponents/CreatePostDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const ProfileTemplate = () => {
    const savedAccommodations = accommodations.slice(0, 2);

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in text-right relative">
                <div className="absolute top-0 left-0 z-10 m-4">
                    <CreatePostDialog
                        trigger={
                            <Button size="sm" className="gap-2 font-bold shadow-lg bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md">
                                <Plus className="w-4 h-4" />
                                <span>إضافة منشور</span>
                            </Button>
                        }
                    />
                </div>
                <div className="space-y-0">
                    <ProfileHeader user={currentStudent} />
                    <div className="bg-card px-6 pb-6 rounded-b-2xl -mt-6 pt-6 shadow-card">
                        <ProfileInfoCards user={currentStudent} />
                    </div>
                </div>

                <ProfileTabs savedAccommodations={savedAccommodations} />
            </div>
        </DashboardLayout>
    );
};
