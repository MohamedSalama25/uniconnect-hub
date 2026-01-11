import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AdminPostsFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
}

const AdminPostsFilter: React.FC<AdminPostsFilterProps> = ({
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
}) => {
    return (
        <div className="flex gap-4 items-center bg-background p-4 rounded-2xl shadow-sm border justify-between flex-wrap">
            <div className="relative flex-1 min-w-[250px] max-w-[300px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="البحث في المنشورات أو أصحابها..."
                    className="pr-10 bg-muted/50 border-none rounded-xl"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex bg-background rounded-xl p-1 border shadow-sm">
                <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "all" ? "bg-primary text-white shadow-md" : "hover:bg-muted"}`}
                >
                    الكل
                </button>
                <button
                    onClick={() => setFilterStatus("pending")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "pending" ? "bg-amber-500 text-white shadow-md" : "hover:bg-muted"}`}
                >
                    قيد المراجعة
                </button>
                <button
                    onClick={() => setFilterStatus("completed")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "completed" ? "bg-green-500 text-white shadow-md" : "hover:bg-muted"}`}
                >
                    المقبولة
                </button>
                <button
                    onClick={() => setFilterStatus("rejected")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === "rejected" ? "bg-red-500 text-white shadow-md" : "hover:bg-muted"}`}
                >
                    المرفوضة
                </button>
            </div>
        </div>
    );
};

export default AdminPostsFilter;
