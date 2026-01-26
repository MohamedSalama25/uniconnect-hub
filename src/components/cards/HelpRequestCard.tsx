import { MessageCircle, Clock, User, Home, GraduationCap, Users, AlertTriangle, HelpCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpRequest } from '@/features/help/types/help-request.types';
import { cn, formatDate } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HelpRequestDetailsDialog } from '@/features/help/components/HelpRequestDetailsDialog';

interface HelpRequestCardProps {
  helpRequest: HelpRequest;
}

const getCategoryConfig = (name: string): {
  icon: LucideIcon;
  label: string;
  color: string;
} => {
  const n = name?.toLowerCase() || "";
  if (n.includes('سكن') || n.includes('house')) return { icon: Home, label: 'سكن', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
  if (n.includes('أكاد') || n.includes('acad')) return { icon: GraduationCap, label: 'أكاديمي', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
  if (n.includes('اجتما') || n.includes('socia')) return { icon: Users, label: 'اجتماعي', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
  if (n.includes('طوارئ') || n.includes('emergen')) return { icon: AlertTriangle, label: 'طوارئ', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
  return { icon: HelpCircle, label: 'أخرى', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' };
};

export function HelpRequestCard({ helpRequest }: HelpRequestCardProps) {
  const navigate = useNavigate();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const config = getCategoryConfig(helpRequest.helpRequestTypeName);
  const Icon = config.icon;

  return (
    <>
      <div className={cn(
        'group relative bg-card/60 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/5 transition-all hover:border-primary/30 hover:shadow-primary/5 text-right overflow-hidden overflow-visible pointer-events-auto cursor-pointer'
      )} onClick={() => setIsDetailsOpen(true)}>
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
                <div className="flex flex-row-reverse items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-muted/50">
                    <User className="w-4 h-4" />
                  </div>
                  <span>{helpRequest.createdUser?.username || "غير معروف"}</span>
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

          {/* Footer */}
          <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-6 pt-4 border-t border-white/5">
            <div className="flex flex-row-reverse items-center gap-2 text-sm text-muted-foreground font-black bg-muted/30 px-5 py-2.5 rounded-2xl">
              <MessageCircle className="w-5 h-5 ml-1 text-primary" />
              <span>0 ردود</span>
            </div>

            <div className="flex flex-row-reverse gap-4 w-full sm:w-auto">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailsOpen(true);
                }}
                className="flex-1 sm:flex-initial h-14 px-8 rounded-2xl font-black bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
              >
                رد على الطلب
              </Button>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/chat');
                }}
                className="flex-1 sm:flex-initial h-14 px-8 rounded-2xl font-black bg-muted/40 border-none hover:bg-muted/60 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Send className="w-5 h-5 ml-3" />
                تواصل خاص
              </Button>
            </div>
          </div>
        </div>
      </div>

      <HelpRequestDetailsDialog
        request={helpRequest}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </>
  );
}
