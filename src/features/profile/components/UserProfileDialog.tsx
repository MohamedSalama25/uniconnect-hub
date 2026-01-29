import { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Briefcase, HeartHandshake, MapPin, Mail, Phone, Calendar, School, CheckCircle2, Star, User, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatImageUrl } from '@/lib/utils';
import { userService, UserPostsResponse, UserInfo } from '../services/user.service';
import { AccommodationCard } from '@/components/cards/AccommodationCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { HelpRequestCard } from '@/components/cards/HelpRequestCard';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { useAuthStore } from '@/store/useAuthStore';
import { SendMessageDialog } from '@/components/globalComponents/SendMessageDialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface UserProfileDialogProps {
    userId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const UserProfileDialog = ({ userId, open, onOpenChange }: UserProfileDialogProps) => {
    const { fullProfile, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [data, setData] = useState<UserPostsResponse['data'][0] | null>(null);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isMessageOpen, setIsMessageOpen] = useState(false);

    const isOwnProfile = fullProfile?.id === userId;

    const handleOpenMessage = () => {
        if (!isAuthenticated) {
            toast.error("يرجى تسجيل الدخول أولاً لإرسال رسالة");
            navigate("/login");
            return;
        }
        setIsMessageOpen(true);
    };

    useEffect(() => {
        if (open && userId) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const response = await userService.getUserPosts(userId);
                    if (response.data && response.data.length > 0) {
                        setData(response.data[0]);
                        // Try to get user info from one of the posts if available
                        const user = response.data[0].readHouses?.[0]?.createdUser ||
                            response.data[0].readServices?.[0]?.createdUser ||
                            response.data[0].readHelpRequests?.[0]?.createdUser;

                        if (user) {
                            setUserInfo(user);
                        }
                    }
                } catch (error) {
                    console.error("Failed to fetch user profile", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else {
            setData(null);
            setUserInfo(null);
        }
    }, [open, userId]);

    if (!open) return null;

    const fullName = userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "مستخدم";
    const avatarSrc = formatImageUrl(userInfo?.profilePictureUrl);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 overflow-hidden flex flex-col" aria-describedby={undefined}>
                <div className="sr-only">
                    <h2 id="user-profile-title">ملف المستخدم</h2>
                </div>
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {/* Header Cover */}
                        <div className="h-40 bg-primary/10 w-full relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
                        </div>

                        <div className="px-6 relative flex-1 flex flex-col min-h-0">
                            {/* User Basic Info - Overlapping Cover */}
                            <div className="flex flex-col gap-6 -mt-16 mb-6 relative z-10 text-right">
                                <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                                    <div className="flex-shrink-0">
                                        <Avatar className="w-32 h-32 border-4 border-background shadow-xl text-3xl bg-background">
                                            {avatarSrc && <AvatarImage src={avatarSrc} className="object-cover" />}
                                            <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    </div>
                                    <div className="flex-1 space-y-3 pb-2">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-3xl font-bold">{fullName}</h2>
                                            {userInfo?.isAccepted && (
                                                <Badge variant="secondary" className="gap-1.5 px-3 py-1">
                                                    <CheckCircle2 className="w-4 h-4 text-success" />
                                                    موثق
                                                </Badge>
                                            )}
                                            {!isOwnProfile && (
                                                <Button
                                                    onClick={handleOpenMessage}
                                                    className="rounded-full gap-2 font-bold"
                                                    size="sm"
                                                >
                                                    <MessageCircle className="w-4 h-4" />
                                                    مراسلة
                                                </Button>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground flex items-center gap-2 text-lg">
                                            <School className="w-5 h-5" />
                                            {userInfo?.universityName} - {userInfo?.collegeName}
                                        </p>

                                        {/* Stats */}
                                        <div className="flex flex-wrap gap-3">
                                            <div className="flex items-center gap-1.5 bg-secondary/20 px-4 py-2 rounded-full">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-bold">{userInfo?.houseAverageRating || userInfo?.servicesAverageRating || 0}</span>
                                                <span className="text-muted-foreground">تقييم عام</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-secondary/20 px-4 py-2 rounded-full">
                                                <Home className="w-4 h-4 text-primary" />
                                                <span className="font-bold">{userInfo?.houseCount || 0}</span>
                                                <span className="text-muted-foreground">سكن</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-secondary/20 px-4 py-2 rounded-full">
                                                <Briefcase className="w-4 h-4 text-primary" />
                                                <span className="font-bold">{userInfo?.servicesCount || 0}</span>
                                                <span className="text-muted-foreground">خدمة</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact & Extra Info Distributed */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-secondary/5 p-4 rounded-xl border">
                                    <div className="space-y-3">
                                        <h3 className="font-semibold flex items-center gap-2 text-primary border-b pb-2">
                                            <User className="w-4 h-4" />
                                            معلومات التواصل
                                        </h3>
                                        <div className="space-y-2">
                                            {userInfo?.phonenumber && (
                                                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                                                    <Phone className="w-4 h-4" />
                                                    <span className="text-foreground font-medium" dir="ltr">{userInfo.phonenumber}</span>
                                                </div>
                                            )}
                                            {userInfo?.email && (
                                                <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                                                    <Mail className="w-4 h-4" />
                                                    <span className="text-sm break-all">{userInfo.email}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 text-muted-foreground">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-sm">انضم في {userInfo?.isAcceptedDate ? format(new Date(userInfo.isAcceptedDate), 'MMMM yyyy', { locale: ar }) : 'غير معروف'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {userInfo?.introductionNote && (
                                        <div className="md:col-span-2 space-y-2 border-r pr-6">
                                            <h3 className="font-semibold flex items-center gap-2 text-primary border-b pb-2">
                                                <Briefcase className="w-4 h-4" />
                                                نبذة تعريفية
                                            </h3>
                                            <p className="leading-relaxed text-muted-foreground italic">
                                                "{userInfo.introductionNote}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col min-h-0">
                                <Tabs defaultValue="houses" className="h-full flex flex-col">
                                    <TabsList className="w-full justify-start mb-4 bg-transparent border-b rounded-none px-0 h-auto p-0 flex-wrap overflow-x-auto">
                                        <TabsTrigger
                                            value="houses"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 gap-2 flex-1 md:flex-none text-base"
                                        >
                                            <Home className="w-5 h-5" />
                                            السكن ({data?.readHouses?.length || 0})
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="services"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 gap-2 flex-1 md:flex-none text-base"
                                        >
                                            <Briefcase className="w-5 h-5" />
                                            الخدمات ({data?.readServices?.length || 0})
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="requests"
                                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3 gap-2 flex-1 md:flex-none text-base"
                                        >
                                            <HeartHandshake className="w-5 h-5" />
                                            طلبات المساعدة ({data?.readHelpRequests?.length || 0})
                                        </TabsTrigger>
                                    </TabsList>

                                    <div className="flex-1 relative overflow-hidden">
                                        <ScrollArea className="h-full w-full pr-4">
                                            <div className="pb-6">
                                                <TabsContent value="houses" className="m-0 space-y-6 outline-none">
                                                    {data?.readHouses?.length ? (
                                                        <div className="space-y-4">
                                                            {data.readHouses.map((house) => (
                                                                <AccommodationCard
                                                                    key={house.id}
                                                                    accommodation={{
                                                                        id: house.id,
                                                                        title: house.name,
                                                                        description: house.description,
                                                                        price: house.price,
                                                                        location: house.address,
                                                                        image: house.imageUrls?.[0] || "",
                                                                        images: house.imageUrls || [],
                                                                        type: house.typeName,
                                                                        rating: house.averageRating,
                                                                        isFavorite: house.isFavorite,
                                                                        bedrooms: house.numberOfRooms,
                                                                        bathrooms: house.numberOfBathrooms,
                                                                        amenities: house.facilityNames || [],
                                                                        hostName: house.createdUser?.username,
                                                                        hostAvatar: house.createdUser?.profilePictureUrl,
                                                                        createdById: house.createdUser?.id,
                                                                        ratings: []
                                                                    } as any}
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-20 bg-secondary/5 rounded-2xl border-2 border-dashed">
                                                            <Home className="w-12 h-12 text-muted-foreground/30 mb-4" />
                                                            <p className="text-muted-foreground text-lg">لا يوجد سكن مضاف</p>
                                                        </div>
                                                    )}
                                                </TabsContent>

                                                <TabsContent value="services" className="m-0 space-y-6 outline-none">
                                                    {data?.readServices?.length ? (
                                                        <div className="space-y-4">
                                                            {data.readServices.map((service) => (
                                                                <ServiceCard key={service.id} service={service as any} />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-20 bg-secondary/5 rounded-2xl border-2 border-dashed">
                                                            <Briefcase className="w-12 h-12 text-muted-foreground/30 mb-4" />
                                                            <p className="text-muted-foreground text-lg">لا توجد خدمات مضافة</p>
                                                        </div>
                                                    )}
                                                </TabsContent>

                                                <TabsContent value="requests" className="m-0 space-y-6 outline-none">
                                                    {data?.readHelpRequests?.length ? (
                                                        <div className="space-y-4">
                                                            {data.readHelpRequests.map((req) => (
                                                                <HelpRequestCard key={req.id} helpRequest={req as any} />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-20 bg-secondary/5 rounded-2xl border-2 border-dashed">
                                                            <HeartHandshake className="w-12 h-12 text-muted-foreground/30 mb-4" />
                                                            <p className="text-muted-foreground text-lg">لا توجد طلبات مساعدة</p>
                                                        </div>
                                                    )}
                                                </TabsContent>
                                            </div>
                                        </ScrollArea>
                                    </div>
                                </Tabs>
                            </div>
                        </div>

                        <SendMessageDialog
                            open={isMessageOpen}
                            onOpenChange={setIsMessageOpen}
                            recipientId={userId || ""}
                            recipientName={fullName}
                        />
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};
