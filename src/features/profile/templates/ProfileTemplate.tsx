import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { currentStudent, accommodations } from '@/data/mockData';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileInfoCards } from '../components/ProfileInfoCards';
import { ProfileTabs } from '../components/ProfileTabs';
import { useAuthStore } from '@/store/useAuthStore';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ProfileTemplate = () => {
    const { user, fullProfile } = useAuthStore();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('posts');

    useEffect(() => {
        if (location.state?.tab) {
            setActiveTab(location.state.tab);
        }
    }, [location.state]);

    const displayUser = fullProfile || currentStudent;
    const savedAccommodations = accommodations.slice(0, 2);

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in text-right relative">
                <div className="space-y-0">
                    <ProfileHeader user={displayUser} onEditClick={() => setActiveTab('settings')} />
                    <div className="bg-card px-6 pb-6 rounded-b-2xl -mt-6 pt-6 shadow-card">
                        <ProfileInfoCards user={displayUser} />
                    </div>
                </div>

                <ProfileTabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    savedAccommodations={savedAccommodations}
                />
            </div>
        </DashboardLayout>
    );
};
