import { useState } from 'react';
import { User, MapPin, Shield, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentStudent } from '@/data/mockData';
import { toast } from 'sonner';

// Import split components
import { PersonalInfoTab } from './settings/PersonalInfoTab';
import { LocationTab } from './settings/LocationTab';
import { SecurityTab } from './settings/SecurityTab';
import { NotificationsTab } from './settings/NotificationsTab';

export const ProfileSettings = () => {
    const [formData, setFormData] = useState({
        name: currentStudent.name,
        email: 'ahmed.m@example.com',
        phone: currentStudent.phone,
        university: currentStudent.university,
        city: currentStudent.city,
        bio: 'طالب في السنة الثالثة، أهتم بالتكنولوجيا والرياضة واستكشاف أماكن جديدة.',
        location: { lat: 30.0444, lng: 31.2357 }
    });

    const handleSave = (section: string) => {
        toast.success(`تم حفظ ${section} بنجاح`);
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
                        <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 rounded-xl">
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
                        <SecurityTab handleSave={handleSave} />
                    </TabsContent>

                    <TabsContent value="notifications" className="mt-0 focus-visible:outline-none">
                        <NotificationsTab handleSave={handleSave} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

