import { useState } from 'react';
import { MessageSquare, Star, Heart, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccommodationCard } from '@/components/cards/AccommodationCard';
import { EmptyState } from '@/components/ui/empty-state';
import type { accommodations } from '@/data/mockData';
import { ProfileSettings } from './ProfileSettings';
import { CreatePostDialog } from '@/components/globalComponents/CreatePostDialog';

interface ProfileTabsProps {
    savedAccommodations: typeof accommodations;
}

export const ProfileTabs = ({ savedAccommodations }: ProfileTabsProps) => {
    const [activeTab, setActiveTab] = useState('posts');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    return (
        <div className="space-y-6">
            <CreatePostDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                trigger={<></>}
            />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="w-full md:w-auto bg-card shadow-card p-1 rounded-xl flex">
                    <TabsTrigger value="posts" className="flex-1 md:flex-none gap-2 rounded-lg">
                        <MessageSquare className="w-4 h-4" />
                        منشوراتي
                    </TabsTrigger>
                    <TabsTrigger value="reviews" className="flex-1 md:flex-none gap-2 rounded-lg">
                        <Star className="w-4 h-4" />
                        تقييماتي
                    </TabsTrigger>
                    <TabsTrigger value="saved" className="flex-1 md:flex-none gap-2 rounded-lg">
                        <Heart className="w-4 h-4" />
                        المحفوظات
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex-1 md:flex-none gap-2 rounded-lg">
                        <Settings className="w-4 h-4" />
                        الإعدادات
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-4">
                    <EmptyState
                        icon={MessageSquare}
                        title="لا توجد منشورات"
                        description="لم تنشر أي طلبات مساعدة بعد."
                        actionLabel="إنشاء منشور"
                        onAction={() => setIsCreateDialogOpen(true)}
                    />
                </TabsContent>

                <TabsContent value="reviews" className="space-y-4">
                    <EmptyState
                        icon={Star}
                        title="لا توجد تقييمات"
                        description="لم تقم بتقييم أي سكن أو خدمة بعد."
                    />
                </TabsContent>

                <TabsContent value="saved" className="space-y-4">
                    {savedAccommodations.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {savedAccommodations.map((accommodation) => (
                                <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Heart}
                            title="لا توجد محفوظات"
                            description="لم تحفظ أي سكن بعد."
                            actionLabel="استعرض السكن"
                            onAction={() => { }}
                        />
                    )}
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <ProfileSettings />
                </TabsContent>
            </Tabs>
        </div>
    );
};
