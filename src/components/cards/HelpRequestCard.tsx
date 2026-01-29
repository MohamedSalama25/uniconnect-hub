import { Clock, User, Home, GraduationCap, Users, AlertTriangle, HelpCircle, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HelpRequest } from '@/features/help/types/help-request.types';
import { cn, formatDate } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { UserProfileDialog } from '@/features/profile/components/UserProfileDialog';
import { SendMessageDialog } from '@/components/globalComponents/SendMessageDialog';
import { useAuthStore } from '@/store/useAuthStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface HelpRequestCardProps {
  helpRequest: HelpRequest;
}

const getCategoryConfig = (name: string): {
  icon: LucideIcon;
  label: string;
  color: string;
} => {
  const n = name?.toLowerCase() || "";
  if (n.includes('سكن') || n.includes('house')) return { icon: Home, label: 'سكن', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
  if (n.includes('أكاد') || n.includes('acad')) return { icon: GraduationCap, label: 'أكاديمي', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
  if (n.includes('اجتما') || n.includes('socia')) return { icon: Users, label: 'اجتماعي', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' };
  if (n.includes('طوارئ') || n.includes('emergen')) return { icon: AlertTriangle, label: 'طوارئ', color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' };
  return { icon: HelpCircle, label: 'أخرى', color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20' };
};

export function HelpRequestCard({ helpRequest }: HelpRequestCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated, fullProfile } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const config = getCategoryConfig(helpRequest.helpRequestTypeName);
  const Icon = config.icon;

  const isOwner = String(fullProfile?.id) === String(helpRequest.createdUser?.id);

  const handleOpenMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("يرجى تسجيل الدخول أولاً لإرسال رسالة");
      navigate("/login");
      return;
    }
    setIsMessageOpen(true);
  };

  return (
    <>
      <div className={cn(
        'group relative bg-card/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-border/50 transition-all hover:border-primary/30 hover:shadow-primary/5 text-right overflow-hidden overflow-visible pointer-events-auto'
      )}>
        {/* Decorative border accent */}
        <div className="absolute top-0 bottom-0 right-0 w-1 bg-primary/20 group-hover:bg-primary transition-colors rounded-full my-8" />

        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row-reverse items-start justify-between gap-6">
            <div className="flex-1 space-y-2">
              <h3 className="font-black text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {helpRequest.title}
              </h3>
              <div className="flex flex-row-reverse items-center gap-6 mt-3 text-sm text-muted-foreground font-bold">
                <div
                  className="flex flex-row-reverse items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileOpen(true);
                  }}
                >
                  <div className="p-1.5 rounded-lg bg-muted/50">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hover:underline">{helpRequest.createdUser?.username || "غير معروف"}</span>
                </div>
                <div className="flex flex-row-reverse items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-muted/50">
                    <Clock className="w-4 h-4" />
                  </div>
                  <span>{formatDate(helpRequest.createdAt)}</span>
                </div>
              </div>
            </div>

            <Badge className={cn('border-none px-5 py-2 rounded-2xl font-black text-sm shadow-sm', config.color)}>
              <Icon className="w-4 h-4 ml-2" />
              {helpRequest.helpRequestTypeName || config.label}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-muted-foreground text-lg leading-relaxed font-medium line-clamp-3">
            {helpRequest.description}
          </p>

          {/* Footer with Contact Button */}
          <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-6 pt-4 border-t border-border/50">
            <div />
            {!isOwner && (
              <Button
                onClick={handleOpenMessage}
                className="w-full sm:w-auto h-12 px-8 rounded-2xl font-black bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
              >
                <Send className="w-5 h-5 ml-3" />
                تواصل خاص
              </Button>
            )}
          </div>
        </div>
      </div>

      <UserProfileDialog
        userId={helpRequest.createdUser?.id}
        open={isProfileOpen}
        onOpenChange={setIsProfileOpen}
      />

      <SendMessageDialog
        open={isMessageOpen}
        onOpenChange={setIsMessageOpen}
        recipientId={helpRequest.createdUser?.id}
        recipientName={helpRequest.createdUser?.username || "صاحب الطلب"}
      />
    </>
  );
}
