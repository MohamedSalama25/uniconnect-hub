import { Search, Building, Briefcase, MessageCircle, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/cards/StatCard';
import { AccommodationCard } from '@/components/cards/AccommodationCard';
import { currentStudent, accommodations, stats } from '@/data/mockData';

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="gradient-primary rounded-3xl p-6 md:p-8 text-primary-foreground">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-bold">
                مرحباً، {currentStudent.name} 👋
              </h1>
              <p className="text-primary-foreground/80">
                {currentStudent.university} • {currentStudent.city}
              </p>
            </div>
            
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن سكن، خدمات..."
                className="pr-12 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-primary-foreground/30"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="السكن المتاح"
            value={stats.availableAccommodations}
            icon={Building}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="الخدمات القريبة"
            value={stats.nearbyServices}
            icon={Briefcase}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="المحادثات النشطة"
            value={stats.activeChats}
            icon={MessageCircle}
          />
          <StatCard
            title="طلبات المساعدة"
            value={stats.helpRequests}
            icon={HelpCircle}
            variant="accent"
          />
        </div>

        {/* Recommended Accommodations */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold">السكن الموصى به</h2>
            <Button variant="ghost" className="text-primary">
              عرض الكل
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {accommodations.slice(0, 3).map((accommodation, index) => (
              <div key={accommodation.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <AccommodationCard accommodation={accommodation} />
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold">إجراءات سريعة</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Building, label: 'البحث عن سكن', color: 'gradient-primary' },
              { icon: Briefcase, label: 'استكشاف الخدمات', color: 'gradient-accent' },
              { icon: HelpCircle, label: 'طلب مساعدة', color: 'bg-success' },
              { icon: MessageCircle, label: 'بدء محادثة', color: 'bg-secondary' },
            ].map((action, index) => (
              <button
                key={index}
                className={`p-6 rounded-2xl text-center transition-all duration-300 hover:scale-105 hover:shadow-lg ${action.color} ${
                  action.color.includes('gradient') ? 'text-primary-foreground' : 
                  action.color === 'bg-success' ? 'text-success-foreground' : 'text-secondary-foreground'
                }`}
              >
                <action.icon className="w-8 h-8 mx-auto mb-3" />
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Index;
