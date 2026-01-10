import { useEffect, useState } from 'react';
import { User, MapPin, Shield, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentStudent } from '@/data/mockData';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/useAuthStore';

import { useNavigate } from 'react-router-dom';

// Import split components
import { PersonalInfoTab } from './settings/PersonalInfoTab';
import { LocationTab } from './settings/LocationTab';
import { SecurityTab } from './settings/SecurityTab';
import { NotificationsTab } from './settings/NotificationsTab';
import { authService } from '@/features/auth/services/auth.service';

export const ProfileSettings = () => {
    const { user, fullProfile, setUserDetails, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: fullProfile?.firstName || '',
        lastName: fullProfile?.lastName || '',
        phone: fullProfile?.phonenumber || fullProfile?.phoneNumber || '',
        university: fullProfile?.universityName || '',
        city: fullProfile?.currentAddress || '',
        introductionNote: fullProfile?.introductionNote || '',
        location: { lat: 30.0444, lng: 31.2357 }
    });

    useEffect(() => {
        if (fullProfile) {
            setFormData({
                firstName: fullProfile.firstName || '',
                lastName: fullProfile.lastName || '',
                phone: fullProfile.phonenumber || fullProfile.phoneNumber || '',
                university: fullProfile.universityName || '',
                city: fullProfile.currentAddress || '',
                introductionNote: fullProfile.introductionNote || '',
                location: { lat: 30.0444, lng: 31.2357 }
            });
        }
    }, [fullProfile, user]);

    const handleSave = async (section: string) => {
        if (section === 'المعلومات الشخصية') {
            setIsLoading(true);
            try {
                const token = user?.token;
                if (!token) return;

                // Construct update payload (matching what the backend expects)
                const updateData = {
                    FirstName: formData.firstName,
                    LastName: formData.lastName,
                    PhoneNumber: formData.phone,
                    CurrentAddress: formData.city,
                    IntroductionNote: formData.introductionNote,
                };

                const updatedProfile = await authService.updateCurrentUser(token, updateData);
                setUserDetails(updatedProfile);
                toast.success(`تم حفظ ${section} بنجاح`);
            } catch (error: any) {
                toast.error(error.message || "فشل تحديث البيانات");
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.success(`تم حفظ ${section} بنجاح`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/welcome');
    };

    return (
        <div className="space-y-6 text-right" dir="rtl">
            <Tabs defaultValue="personal" className="flex flex-col md:flex-row gap-6">
                <TabsList className="md:w-64 flex flex-col items-stretch h-fit bg-card border shadow-sm p-2 rounded-2xl gap-1">
                    <TabsTrigger value="personal" className="justify-start gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <User className="w-4 h-4 ml-2" />
                        المعلومات الشخصية
                    </TabsTrigger>
                    <TabsTrigger value="location" className="justify-start gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <MapPin className="w-4 h-4 ml-2" />
                        الموقع الجغرافي
                    </TabsTrigger>
                    <TabsTrigger value="security" className="justify-start gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Shield className="w-4 h-4 ml-2" />
                        الأمان والحماية
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="justify-start gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Bell className="w-4 h-4 ml-2" />
                        الإشعارات
                    </TabsTrigger>
                    <div className="mt-4 pt-4 border-t px-2">
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 rounded-xl"
                        >
                            <LogOut className="w-4 h-4 ml-2" />
                            تسجيل الخروج
                        </Button>
                    </div>
                </TabsList>

                <div className="flex-1">
                    <TabsContent value="personal" className="mt-0 focus-visible:outline-none">
                        <PersonalInfoTab
                            formData={formData}
                            setFormData={setFormData}
                            handleSave={handleSave}
                        />
                    </TabsContent>

                    <TabsContent value="location" className="mt-0 focus-visible:outline-none">
                        <LocationTab
                            formData={formData}
                            setFormData={setFormData}
                            handleSave={handleSave}
                        />
                    </TabsContent>

                    <TabsContent value="security" className="mt-0 focus-visible:outline-none">
                        <SecurityTab />
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-0 focus-visible:outline-none">
                        <NotificationsTab handleSave={handleSave} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

