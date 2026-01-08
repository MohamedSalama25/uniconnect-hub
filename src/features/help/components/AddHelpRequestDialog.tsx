import { useState } from 'react';
import { Plus } from 'lucide-react';
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
import { helpCategories } from './HelpFilters';

export const AddHelpRequestDialog = () => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
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
                    <div className="space-y-2 text-right">
                        <Label>عنوان الطلب</Label>
                        <Input placeholder="اكتب عنواناً واضحاً لطلبك..." className="text-right" />
                    </div>
                    <div className="space-y-2 text-right">
                        <Label>التفاصيل</Label>
                        <Textarea
                            placeholder="اشرح ما تحتاج المساعدة فيه..."
                            rows={4}
                            className="text-right"
                        />
                    </div>
                    <div className="space-y-2 text-right">
                        <Label>التصنيف</Label>
                        <div className="flex flex-wrap gap-2 justify-end">
                            {helpCategories.filter(c => c.id !== 'all').map((cat) => (
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
                    <Button className="w-full" onClick={() => setOpen(false)}>
                        نشر الطلب
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
