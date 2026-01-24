import React from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface AdminPostStatusBadgeProps {
    status: string;
}

const AdminPostStatusBadge: React.FC<AdminPostStatusBadgeProps> = ({ status }) => {
    if (status === "pending") return <Badge className="bg-amber-500 hover:bg-amber-600 border-none gap-1 px-4 py-1 rounded-full"><Clock className="w-3 h-3" /> قيد المراجعة</Badge>;
    if (status === "completed") return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none gap-1 px-4 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> مقبول</Badge>;
    return <Badge className="bg-red-500 hover:bg-red-600 border-none gap-1 px-4 py-1 rounded-full"><XCircle className="w-3 h-3" /> مرفوض</Badge>;
};

export default AdminPostStatusBadge;
