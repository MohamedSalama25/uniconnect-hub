import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { helpRequestService } from '../services/help-request.service';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { HelpRequest } from '../types/help-request.types';

interface AddHelpRequestDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    initialData?: HelpRequest;
    trigger?: React.ReactNode;
}

export const AddHelpRequestDialog = ({ open: externalOpen, onOpenChange: setExternalOpen, initialData, trigger }: AddHelpRequestDialogProps) => {
    const [internalOpen, setInternalOpen] = useState(false);

    const open = externalOpen !== undefined ? externalOpen : internalOpen;
    const setOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

    const isEditing = !!initialData;
    const queryClient = useQueryClient();

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setSelectedTypeId(initialData.helpRequestTypeId);
        } else {
            resetForm();
        }
    }, [initialData, open]);

    const { data: typesData } = useQuery({
        queryKey: ['help-request-types'],
        queryFn: () => helpRequestService.getRequestTypes({ pageSize: 100 }),
    });
    const types = typesData?.data || [];

    const mutation = useMutation({
        mutationFn: (data: any) => isEditing && initialData
            ? helpRequestService.updateHelpRequest(initialData.id, data)
            : helpRequestService.createHelpRequest(data),
        onSuccess: () => {
            toast.success(isEditing ? "تم تحديث طلب المساعدة بنجاح" : "تم نشر طلب المساعدة بنجاح");
            queryClient.invalidateQueries({ queryKey: ['help-requests'] });
            queryClient.invalidateQueries({ queryKey: ['admin-help-requests'] });
            if (isEditing && initialData) {
                queryClient.invalidateQueries({ queryKey: ['help-request-detail', initialData.id.toString()] });
            }
            setOpen(false);
            if (!isEditing) resetForm();
        },
        onError: () => {
            toast.error("فشل في العملية. يرجى المحاولة مرة أخرى.");
        }
    });

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setSelectedTypeId(null);
    };

    const handleSubmit = () => {
        if (!title || !description || !selectedTypeId) {
            toast.error("يرجى إكمال جميع الحقول");
            return;
        }
        mutation.mutate({ title, description, helpRequestTypeId: selectedTypeId });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger !== null && (trigger || (
                <DialogTrigger asChild>
                    <Button className="h-14 px-8 rounded-2xl font-black bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
                        <Plus className="w-5 h-5 ml-3" />
                        طلب مساعدة جديد
                    </Button>
                </DialogTrigger>
            ))}
            <DialogContent dir="rtl" className="max-w-xl rounded-[2.5rem] bg-card border-border p-8 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-black tracking-tight mb-2">
                        {isEditing ? "تعديل طلب المساعدة" : "طلب مساعدة جديد"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 pt-6 text-right">
                    <div className="space-y-3">
                        <Label className="text-lg font-black mr-1">عنوان الطلب</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="اكتب عنواناً واضحاً لطلبك..."
                            className="h-14 bg-muted/30 border-none rounded-2xl px-6 text-lg font-bold focus-visible:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-lg font-black mr-1">التفاصيل</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="اشرح ما تحتاج المساعدة فيه بالتفصيل..."
                            rows={5}
                            className="bg-muted/30 border-none rounded-2xl p-6 text-lg font-medium focus-visible:ring-primary/20 transition-all resize-none"
                        />
                    </div>
                    <div className="space-y-4">
                        <Label className="text-lg font-black mr-1">التصنيف</Label>
                        <div className="flex flex-wrap gap-3 justify-start">
                            {types.map((type) => {
                                const isSelected = selectedTypeId === type.id;
                                return (
                                    <Badge
                                        key={type.id}
                                        variant={isSelected ? "default" : "outline"}
                                        onClick={() => setSelectedTypeId(type.id)}
                                        className={cn(
                                            "cursor-pointer px-6 py-2.5 rounded-xl border-none font-bold text-sm transition-all hover:scale-105",
                                            isSelected
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        {type.name}
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>
                    <div className="pt-6">
                        <Button
                            disabled={mutation.isPending}
                            className="w-full h-16 rounded-2xl text-xl font-black bg-primary text-primary-foreground hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20"
                            onClick={handleSubmit}
                        >
                            {mutation.isPending ? "جاري الحفظ..." : (isEditing ? "حفظ التغييرات" : "نشر الطلب الآن")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
