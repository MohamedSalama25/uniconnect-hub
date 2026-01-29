import { Clock, Home, GraduationCap, Users, AlertTriangle, HelpCircle, Send } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      <div
        className={cn(
          'group relative bg-card/40 backdrop-blur-md rounded-[2rem] p-5 shadow-2xl border border-white/5 transition-all duration-500 hover:shadow-primary/10 text-right overflow-hidden flex flex-col h-full'
        )}
        dir="rtl"
      >
        {/* Decorative background glow */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500" />

        <div className="relative flex flex-col h-full space-y-6">
          {/* Header Area */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between flex-row-reverse">
              <Badge className={cn('border-none px-4 py-2 rounded-xl font-black text-xs shadow-sm backdrop-blur-sm', config.color)}>
                <Icon className="w-4 h-4 ml-1.5" />
                {helpRequest.helpRequestTypeName || config.label}
              </Badge>
              <div className="flex flex-row-reverse items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-black tracking-tight">{formatDate(helpRequest.createdAt)}</span>
              </div>
            </div>

            <h3 className="font-black text-3xl md:text-4xl tracking-tight text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
              {helpRequest.title}
            </h3>
          </div>

          {/* Body Section */}
          <div className="flex-1 space-y-5">
            <p className="text-muted-foreground text-base leading-relaxed font-medium line-clamp-3">
              {helpRequest.description}
            </p>

            {/* User Profile Hookup */}
            <div
              className="flex items-center gap-3 p-3 rounded-2xl bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer group/user border border-white/5 self-end w-full"
              onClick={(e) => {
                e.stopPropagation();
                setIsProfileOpen(true);
              }}
            >
              <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover/user:border-primary/50 transition-colors shadow-lg">
                <AvatarImage src={helpRequest.createdUser?.profilePictureUrl} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-black text-base">
                  {helpRequest.createdUser?.username?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start flex-1 text-right">
                <span className="font-black text-sm group-hover/user:text-primary transition-colors">
                  {helpRequest.createdUser?.username || "غير معروف"}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-black">طالب المساعدة</span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          {!isOwner && (
            <div className="pt-2">
              <Button
                onClick={handleOpenMessage}
                className="w-full h-12 rounded-xl font-black text-base bg-primary text-primary-foreground hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group/btn"
              >
                <Send className="w-5 h-5 ml-1" />
                تواصل خاص الآن
              </Button>
            </div>
          )}
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
