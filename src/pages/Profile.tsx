import { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Building, 
  Edit, 
  Settings, 
  LogOut,
  BookMarked,
  MessageSquare,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AccommodationCard } from '@/components/cards/AccommodationCard';
import { RatingStars } from '@/components/cards/RatingStars';
import { EmptyState } from '@/components/ui/empty-state';
import { currentStudent, accommodations } from '@/data/mockData';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const savedAccommodations = accommodations.slice(0, 2);

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {/* Cover */}
          <div className="h-32 gradient-primary" />
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
              <Avatar className="w-24 h-24 border-4 border-card shadow-lg">
                <AvatarImage src={currentStudent.avatar} alt={currentStudent.name} />
                <AvatarFallback className="text-2xl">{currentStudent.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 md:mb-2">
                <h1 className="text-2xl font-bold">{currentStudent.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={currentStudent.rating} size="sm" />
                  <span className="text-sm text-muted-foreground">• طالب نشط</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="btn-hover">
                  <Edit className="w-4 h-4 ml-2" />
                  تعديل الملف
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl">
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الجامعة</p>
                  <p className="font-medium">{currentStudent.university}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                <div className="p-2 rounded-lg bg-accent/10 text-accent">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">المدينة</p>
                  <p className="font-medium">{currentStudent.city}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-secondary/50 rounded-xl">
                <div className="p-2 rounded-lg bg-success/10 text-success">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">الهاتف</p>
                  <p className="font-medium" dir="ltr">{currentStudent.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="w-full md:w-auto bg-card shadow-card p-1 rounded-xl">
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
              onAction={() => {}}
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
                onAction={() => {}}
              />
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
              <h3 className="font-semibold text-lg">إعدادات الحساب</h3>
              
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 ml-3" />
                  تعديل المعلومات الشخصية
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="w-4 h-4 ml-3" />
                  تغيير البريد الإلكتروني
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 ml-3" />
                  تغيير رقم الهاتف
                </Button>
                <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                  <LogOut className="w-4 h-4 ml-3" />
                  تسجيل الخروج
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
