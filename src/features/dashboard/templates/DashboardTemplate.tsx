import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { currentStudent } from '@/data/mockData';
import { useAuthStore } from '@/store/useAuthStore';
import { DashboardWelcome } from '../components/DashboardWelcome';
import { DashboardStats } from '../components/DashboardStats';
import { DashboardRecommended } from '../components/DashboardRecommended';
import { DashboardServices } from '../components/DashboardServices';
import { DashboardHelpRequests } from '../components/DashboardHelpRequests';
import { DashboardQuickActions } from '../components/DashboardQuickActions';
import { useMainPageData } from '../hooks/useMainPageData';
import { CustomLoader } from '@/components/ui/loader';

export const DashboardTemplate = () => {
    const { user, fullProfile } = useAuthStore();
    const { data, isLoading, error } = useMainPageData();

    // Fallback to mock if no real user data (for dev/demo)
    const displayUser = fullProfile || currentStudent;

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] py-12">
                    <CustomLoader size={60} />
                    <p className="text-muted-foreground font-bold animate-pulse mt-4">جاري تحميل لوحة التحكم...</p>
                </div>
            </DashboardLayout>
        );
    }

    const statsData = {
        acceptedHouses: data?.acceptedHouses || 0,
        acceptedServices: data?.acceptedServices || 0,
        acceptedHelpRequests: data?.acceptedHelpRequests || 0
    };

    return (
        <DashboardLayout>
            <div className="space-y-12 animate-fade-in relative pb-12">
                <DashboardWelcome user={displayUser} />
                <DashboardStats stats={statsData} />

                <DashboardRecommended accommodations={data?.readHouse || []} />

                <DashboardServices services={data?.readServices || []} />

                <DashboardHelpRequests helpRequests={data?.readHelps || []} />

                <DashboardQuickActions />
            </div>
        </DashboardLayout>
    );
};
