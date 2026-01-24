import React from "react";
import { Search, Home, AlertCircle, Car, BookOpen, Clock, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export type PostCategory = "housing" | "complaints" | "transport" | "tools";

interface AdminPostsFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
    selectedCategory: PostCategory;
    setSelectedCategory: (category: PostCategory) => void;
}

const categories = [
    { id: "housing", label: "سكن", icon: Home },
    { id: "complaints", label: "شكاوى", icon: AlertCircle },
    { id: "transport", label: "مواصلات", icon: Car },
    { id: "tools", label: "أدوات", icon: BookOpen },
];

const AdminPostsFilter: React.FC<AdminPostsFilterProps> = ({
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    selectedCategory,
    setSelectedCategory,
}) => {
    return (
        <div className="space-y-6">
            {/* Category Selector */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide py-2">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id as PostCategory)}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all whitespace-nowrap shadow-sm border ${selectedCategory === cat.id
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                            : "bg-background hover:bg-muted border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <cat.icon className={`w-5 h-5 ${selectedCategory === cat.id ? "text-white" : "text-primary"}`} />
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="flex gap-4 items-center bg-background p-5 rounded-3xl shadow-sm border justify-between flex-wrap">
                <div className="relative flex-1 min-w-[280px] max-w-[350px]">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="البحث في المنشورات..."
                        className="pr-12 h-12 bg-muted/40 border-none rounded-2xl focus-visible:ring-1 focus-visible:ring-primary/20 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex bg-muted/30 rounded-2xl p-1.5 gap-2 border border-muted/50 shadow-inner">
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:text-foreground ${filterStatus === "all"
                            ? "bg-background text-primary shadow-md"
                            : "text-muted-foreground hover:bg-white/50"
                            }`}
                    >
                        الكل
                    </button>
                    <button
                        onClick={() => setFilterStatus("pending")}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 hover:text-foreground ${filterStatus === "pending"
                            ? "bg-amber-500 text-white shadow-md"
                            : "text-muted-foreground hover:bg-amber-50/50"
                            }`}
                    >
                        <Clock className="w-4 h-4" />
                        قيد المراجعة
                    </button>
                    <button
                        onClick={() => setFilterStatus("completed")}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 hover:text-foreground ${filterStatus === "completed"
                            ? "bg-green-500 text-white shadow-md"
                            : "text-muted-foreground hover:bg-green-50/50"
                            }`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        المقبولة
                    </button>
                    <button
                        onClick={() => setFilterStatus("rejected")}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 hover:text-foreground ${filterStatus === "rejected"
                            ? "bg-red-500 text-white shadow-md"
                            : "text-muted-foreground hover:bg-red-50/50"
                            }`}
                    >
                        <XCircle className="w-4 h-4" />
                        المرفوضة
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminPostsFilter;
