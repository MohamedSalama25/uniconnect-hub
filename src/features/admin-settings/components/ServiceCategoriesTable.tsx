import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import UniTable, { Action } from "@/components/globalComponents/UniTable";
import { Button } from "@/components/ui/button";
import { adminSettingsService } from "../services/admin-settings.service";
import { ServiceCategory, ServiceCategoryParams } from "../types/admin-settings.types";
import { AddEditServiceCategoryDialog } from "./AddEditServiceCategoryDialog";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";
import { IconRenderer } from "@/components/globalComponents/IconRenderer";

export function ServiceCategoriesTable() {
    const queryClient = useQueryClient();
    const [params, setParams] = useState<ServiceCategoryParams>({
        pageIndex: 1,
        pageSize: 10,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    const { data: serviceCategoriesData, isLoading } = useQuery({
        queryKey: ["service-categories", params],
        queryFn: () => adminSettingsService.getServiceCategories(params),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => adminSettingsService.deleteServiceCategory(id),
        onSuccess: () => {
            toast.success("تم حذف قسم الخدمة بنجاح");
            queryClient.invalidateQueries({ queryKey: ["service-categories"] });
            setIsConfirmOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "فشل حذف القسم");
        },
    });

    const columns: ColumnDef<ServiceCategory>[] = [
        {
            accessorKey: "id",
            header: "التعريف",
        },
        {
            accessorKey: "name",
            header: "اسم القسم",
        },
        {
            accessorKey: "icon",
            header: "الأيقونة",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <IconRenderer name={row.original.icon || ""} size={16} />
                    </div>
                    <span className="text-sm text-muted-foreground font-medium">{row.original.icon || "بدون أيقونة"}</span>
                </div>
            ),
        },
    ];

    const actions: Action<ServiceCategory>[] = [
        {
            label: "تعديل",
            icon: Edit,
            onClick: (row) => {
                setSelectedCategory(row);
                setIsDialogOpen(true);
            },
        },
        {
            label: "حذف",
            icon: Trash2,
            classname: "text-red-500",
            onClick: (row) => {
                setCategoryToDelete(row.id);
                setIsConfirmOpen(true);
            },
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">أقسام الخدمات</h2>
                <Button onClick={() => { setSelectedCategory(null); setIsDialogOpen(true); }} className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة قسم
                </Button>
            </div>

            <UniTable
                columns={columns}
                data={serviceCategoriesData?.data || []}
                actions={actions}
                totalItems={serviceCategoriesData?.count || 0}
                itemsPerPage={params.pageSize || 10}
                currentPage={params.pageIndex}
                onPageChange={(page) => setParams(prev => ({ ...prev, pageIndex: page }))}
                isLoading={isLoading}
                tableName="أقسام الخدمات"
            />

            <AddEditServiceCategoryDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedCategory}
            />

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="حذف قسم الخدمة"
                description="هل أنت متأكد من حذف قسم الخدمة هذا؟ لا يمكن التراجع عن هذا الإجراء."
                onConfirm={() => categoryToDelete && deleteMutation.mutate(categoryToDelete)}
                variant="destructive"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
