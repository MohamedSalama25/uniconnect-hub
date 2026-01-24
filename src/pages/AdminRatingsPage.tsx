import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import UniTable, { Action } from "@/components/globalComponents/UniTable";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, User, Eye, EyeOff, Loader, Building, Briefcase } from "lucide-react";
import { houseService } from "@/features/accommodation-list/services/house.service";
import { Rating } from "@/features/accommodation-list/types/house.types";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const AdminRatingsPage = () => {
    const queryClient = useQueryClient();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [confirmToggle, setConfirmToggle] = useState<{ id: number; status: boolean } | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<"housing" | "services">("housing");

    const { data: ratings, isLoading } = useQuery({
        queryKey: ["admin-ratings", selectedCategory],
        queryFn: () => houseService.getAdminRatings(), // assuming same endpoint for now or handling in service
    });

    const publishMutation = useMutation({
        mutationFn: ({ id, status }: { id: number; status: boolean }) =>
            houseService.togglePublishRating(id, status),
        onSuccess: () => {
            toast.success("تم تحديث حالة النشر بنجاح");
            queryClient.invalidateQueries({ queryKey: ["admin-ratings"] });
            setConfirmToggle(null);
        },
        onError: () => {
            toast.error("فشل في تحديث حالة النشر");
        },
    });

    const columns = [
        {
            accessorKey: "houseName",
            header: selectedCategory === "housing" ? "اسم السكن" : "اسم الخدمة",
            cell: ({ row }: any) => <span className="font-bold text-primary">{row.original.houseName}</span>,
        },
        {
            accessorKey: "stars",
            header: "التقييم",
            cell: ({ row }: any) => (
                <div className="flex items-center mx-auto gap-1 text-accent border border-accent/20 bg-accent/5 px-2 py-1 rounded-lg w-fit">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-sm font-black">{row.original.stars}</span>
                </div>
            ),
        },
        {
            accessorKey: "comment",
            header: "التعليق",
            cell: ({ row }: any) => (
                <p className="max-w-[300px] truncate text-muted-foreground italic" title={row.original.comment}>
                    "{row.original.comment}"
                </p>
            ),
        },
        {
            accessorKey: "ratedOn",
            header: "التاريخ",
            cell: ({ row }: any) => <span>{formatDate(row.original.ratedOn)}</span>,
        },
        {
            accessorKey: "isPublished",
            header: "النشر",
            cell: ({ row }: any) => (
                <Switch
                    checked={row.original.isPublished}
                    onCheckedChange={(checked) => setConfirmToggle({ id: row.original.id, status: checked })}
                />

            ),
        },
    ];

    const actions: Action<Rating>[] = [];

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black text-foreground">إدارة التقييمات</h1>
                        <p className="text-muted-foreground">راجع تقييمات المستخدمين وقم بإدارة ظهورها على المنصة.</p>
                    </div>

                    <div className="flex bg-card p-1 items-center rounded-2xl border shadow-sm self-start">
                        <button
                            onClick={() => setSelectedCategory("housing")}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
                                selectedCategory === "housing" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted"
                            )}
                        >
                            <Building className="w-4 h-4" />
                            السكن
                        </button>
                        <button
                            onClick={() => setSelectedCategory("services")}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all",
                                selectedCategory === "services" ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted"
                            )}
                        >
                            <Briefcase className="w-4 h-4" />
                            الخدمات
                        </button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center p-20">
                        <Loader className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <UniTable
                        columns={columns as any}
                        data={ratings || []}
                        actions={actions}
                        tableName="تقييمات"
                        currentPage={pageIndex}
                        onPageChange={setPageIndex}
                        totalItems={ratings?.length || 0}
                        itemsPerPage={pageSize}
                    />
                )}

                <ConfirmDialog
                    isOpen={!!confirmToggle}
                    onClose={() => setConfirmToggle(null)}
                    onConfirm={() => confirmToggle && publishMutation.mutate(confirmToggle)}
                    title={confirmToggle?.status ? "نشر التقييم" : "إلغاء نشر التقييم"}
                    description={
                        confirmToggle?.status
                            ? "هل أنت متأكد من أنك تريد نشر هذا التقييم؟ سيظهر للجميع على المنصة."
                            : "هل أنت متأكد من أنك تريد إخفاء هذا التقييم؟ لن يظهر للمستخدمين الآخرين."
                    }
                    confirmText={confirmToggle?.status ? "نعم، انشر" : "نعم، أخفِ"}
                    variant={confirmToggle?.status ? "default" : "warning"}
                    isLoading={publishMutation.isPending}
                />
            </div>
        </DashboardLayout>
    );
};

export default AdminRatingsPage;
