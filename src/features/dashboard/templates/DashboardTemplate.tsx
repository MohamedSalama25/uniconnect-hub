import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { currentStudent, accommodations, stats } from '@/data/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { DashboardWelcome } from '../components/DashboardWelcome';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardRecommended } from '../components/DashboardRecommended';
import { DashboardQuickActions } from '../components/DashboardQuickActions';
import { CreatePostDialog } from '@/components/globalComponents/CreatePostDialog';

export const DashboardTemplate = () => {
    const { user, fullProfile } = useAuthStore();

    // Fallback to mock if no real user data (for dev/demo)
    const displayUser = fullProfile || currentStudent;

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in relative">
                <DashboardWelcome user={displayUser} />
                <DashboardStats stats={stats} />
                <DashboardRecommended accommodations={accommodations} />
                <DashboardQuickActions />
            </div>
        </DashboardLayout>
    );
};
