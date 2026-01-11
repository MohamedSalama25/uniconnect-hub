import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";

interface AdminPostDetailsHeaderProps {
    onBack: () => void;
    onApprove: () => void;
    onReject: () => void;
}

const AdminPostDetailsHeader: React.FC<AdminPostDetailsHeaderProps> = ({
    onBack,
    onApprove,
    onReject,
}) => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="rounded-full hover:bg-background shadow-sm"
                >
                    <ArrowRight className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">تفاصيل المنشور</h1>
                    <p className="text-muted-foreground mt-1">مراجعة بيانات المنشور وصاحبه قبل القبول</p>
                </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
                <Button
                    variant="destructive"
                    className="flex-1 md:flex-none rounded-xl gap-2 font-bold px-6"
                    onClick={onReject}
                >
                    <XCircle className="w-4 h-4" /> رفض
                </Button>
                <Button
                    className="flex-1 md:flex-none rounded-xl gap-2 font-bold px-6 bg-green-600 hover:bg-green-700"
                    onClick={onApprove}
                >
                    <CheckCircle className="w-4 h-4" /> قبول
                </Button>
            </div>
        </div>
    );
};

export default AdminPostDetailsHeader;
