import { useState } from 'react';
import { Plus, Home, GraduationCap, Users, AlertTriangle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HelpRequestCard } from '@/components/cards/HelpRequestCard';
import { EmptyState } from '@/components/ui/empty-state';
import { helpRequests, HelpRequest } from '@/data/mockData';
import { LucideIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const categories: { id: HelpRequest['category'] | 'all'; label: string; icon: LucideIcon }[] = [
  { id: 'all', label: 'الكل', icon: HelpCircle },
  { id: 'housing', label: 'سكن', icon: Home },
  { id: 'academic', label: 'أكاديمي', icon: GraduationCap },
  { id: 'social', label: 'اجتماعي', icon: Users },
  { id: 'emergency', label: 'طوارئ', icon: AlertTriangle },
];

const HelpRequests = () => {
  const [selectedCategory, setSelectedCategory] = useState<HelpRequest['category'] | 'all'>('all');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredRequests = helpRequests.filter(
    req => selectedCategory === 'all' || req.category === selectedCategory
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">طلبات المساعدة</h1>
            <p className="text-muted-foreground mt-1">
              ساعد زملاءك الطلاب أو اطلب المساعدة
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-hover">
                <Plus className="w-4 h-4 ml-2" />
                طلب مساعدة جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>طلب مساعدة جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>عنوان الطلب</Label>
                  <Input placeholder="اكتب عنواناً واضحاً لطلبك..." />
                </div>
                <div className="space-y-2">
                  <Label>التفاصيل</Label>
                  <Textarea 
                    placeholder="اشرح ما تحتاج المساعدة فيه..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label>التصنيف</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.filter(c => c.id !== 'all').map((cat) => (
                      <Badge
                        key={cat.id}
                        variant="outline"
                        className="cursor-pointer px-3 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <cat.icon className="w-3.5 h-3.5 ml-1" />
                        {cat.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button className="w-full" onClick={() => setDialogOpen(false)}>
                  نشر الطلب
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 flex items-center gap-2"
              onClick={() => setSelectedCategory(category.id)}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </Badge>
          ))}
        </div>

        {/* Help Requests List */}
        {filteredRequests.length > 0 ? (
          <div className="space-y-4">
            {filteredRequests.map((request, index) => (
              <div 
                key={request.id} 
                className="animate-slide-up" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <HelpRequestCard helpRequest={request} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={HelpCircle}
            title="لا توجد طلبات"
            description="لم نعثر على طلبات مساعدة في هذا التصنيف."
            actionLabel="عرض جميع الطلبات"
            onAction={() => setSelectedCategory('all')}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default HelpRequests;
