import { useState } from 'react';
import { Heart, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccommodationCard } from '@/components/cards/AccommodationCard';
import { EmptyState } from '@/components/ui/empty-state';
import { ProfileSettings } from './ProfileSettings';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { houseService } from '@/features/accommodation-list/services/house.service';
import { useAuthStore } from '@/store/useAuthStore';

interface ProfileTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const ProfileTabs = ({ activeTab, setActiveTab }: ProfileTabsProps) => {
    const { isAuthenticated } = useAuthStore();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    const { data: rawData, isLoading: isFavoritesLoading } = useQuery({
        queryKey: ['user-favorites'],
        queryFn: () => houseService.getFavorites(),
        enabled: isAuthenticated && activeTab === 'saved'
    });

    // Use the already-processed array from the service
    const savedHouses = rawData || [];

    return (
        <div className="space-y-6">

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="w-full md:w-auto bg-card shadow-card p-1 rounded-xl flex">
                    <TabsTrigger value="saved" className="flex-1 md:flex-none gap-2 rounded-lg">
                        <Heart className="w-4 h-4" />
                        المحفوظات
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex-1 md:flex-none gap-2 rounded-lg">
                        <Settings className="w-4 h-4" />
                        الإعدادات
                    </TabsTrigger>
                </TabsList>


                <TabsContent value="saved" className="space-y-4">
                    {isFavoritesLoading ? (
                        <div className="flex flex-col items-center justify-center p-12 min-h-[300px] border border-dashed rounded-3xl bg-muted/5">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                            <p className="text-muted-foreground text-sm">جاري تحميل المحفوظات...</p>
                        </div>
                    ) : savedHouses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {savedHouses.map((house) => (
                                <AccommodationCard
                                    key={house.id}
                                    accommodation={{
                                        id: house.id.toString(),
                                        title: house.name,
                                        image: house.imageUrls?.[0] || "",
                                        images: house.imageUrls || [],
                                        price: house.price,
                                        distance: 0,
                                        type: house.typeName?.toLowerCase().includes('shared') ? 'shared' : 'private',
                                        rating: house.averageRating,
                                        location: house.address,
                                        bedrooms: house.numberOfRooms,
                                        bathrooms: house.numberOfBathrooms,
                                        amenities: house.facilityNames || [],
                                        description: house.description,
                                        hostName: house.createdUser ? `${house.createdUser.firstName} ${house.createdUser.lastName}` : house.createdByName,
                                        hostAvatar: house.createdUser?.profilePictureUrl || house.createdByPhotoUrl,
                                        isFavorite: house.isFavorite,
                                    }}
                                />
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
