import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { currentStudent, accommodations } from '@/data/mockData';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileInfoCards } from '../components/ProfileInfoCards';
import { ProfileTabs } from '../components/ProfileTabs';
import { CreatePostDialog } from '@/components/globalComponents/CreatePostDialog';

export const ProfileTemplate = () => {
    const savedAccommodations = accommodations.slice(0, 2);

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in text-right relative">
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
