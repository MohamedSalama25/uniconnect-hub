import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import UniTable, { Action } from "@/components/globalComponents/UniTable";
import { Button } from "@/components/ui/button";
import { adminSettingsService } from "../services/admin-settings.service";
import { HelpRequestType, HelpRequestTypeParams } from "../types/admin-settings.types";
import { AddEditHelpRequestTypeDialog } from "./AddEditHelpRequestTypeDialog";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";

export function HelpRequestTypesTable() {
    const queryClient = useQueryClient();
    const [params, setParams] = useState<HelpRequestTypeParams>({
        pageIndex: 1,
        pageSize: 10,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<HelpRequestType | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState<number | null>(null);

    const { data: helpTypesData, isLoading } = useQuery({
        queryKey: ["help-request-types", params],
        queryFn: () => adminSettingsService.getHelpRequestTypes(params),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => adminSettingsService.deleteHelpRequestType(id),
        onSuccess: () => {
            toast.success("تم حذف نوع الطلب بنجاح");
            queryClient.invalidateQueries({ queryKey: ["help-request-types"] });
            setIsConfirmOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "فشل حذف النوع");
        },
    });

    const columns: ColumnDef<HelpRequestType>[] = [
        {
            accessorKey: "id",
            header: "التعريف",
        },
        {
            accessorKey: "name",
            header: "اسم النوع",
        },
    ];

    const actions: Action<HelpRequestType>[] = [
        {
            label: "تعديل",
            icon: Edit,
            onClick: (row) => {
                setSelectedType(row);
                setIsDialogOpen(true);
            },
        },
        {
            label: "حذف",
            icon: Trash2,
            classname: "text-red-500",
            onClick: (row) => {
                setTypeToDelete(row.id);
                setIsConfirmOpen(true);
            },
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">أنواع طلبات المساعدة</h2>
                <Button onClick={() => { setSelectedType(null); setIsDialogOpen(true); }} className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة نوع
                </Button>
            </div>

            <UniTable
                columns={columns}
                data={helpTypesData?.data || []}
                actions={actions}
                totalItems={helpTypesData?.count || 0}
                itemsPerPage={params.pageSize || 10}
                currentPage={params.pageIndex}
                onPageChange={(page) => setParams(prev => ({ ...prev, pageIndex: page }))}
                isLoading={isLoading}
                tableName="أنواع طلبات المساعدة"
            />

            <AddEditHelpRequestTypeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedType}
            />

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="حذف نوع الطلب"
                description="هل أنت متأكد من حذف نوع الطلب هذا؟ لا يمكن التراجع عن هذا الإجراء."
                onConfirm={() => typeToDelete && deleteMutation.mutate(typeToDelete)}
                variant="destructive"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
