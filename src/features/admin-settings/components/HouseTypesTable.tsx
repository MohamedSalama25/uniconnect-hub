import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import UniTable, { Action } from "@/components/globalComponents/UniTable";
import { Button } from "@/components/ui/button";
import { adminSettingsService } from "../services/admin-settings.service";
import { HouseType, HouseTypeParams } from "../types/admin-settings.types";
import { AddEditHouseTypeDialog } from "./AddEditHouseTypeDialog";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";

export function HouseTypesTable() {
    const queryClient = useQueryClient();
    const [params, setParams] = useState<HouseTypeParams>({
        pageIndex: 1,
        pageSize: 10,
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedType, setSelectedType] = useState<HouseType | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState<number | null>(null);

    const { data: houseTypesData, isLoading } = useQuery({
        queryKey: ["house-types", params],
        queryFn: () => adminSettingsService.getHouseTypes(params),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => adminSettingsService.deleteHouseType(id),
        onSuccess: () => {
            toast.success("تم حذف نوع السكن بنجاح");
            queryClient.invalidateQueries({ queryKey: ["house-types"] });
            setIsConfirmOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "فشل حذف النوع");
        },
    });

    const columns: ColumnDef<HouseType>[] = [
        {
            accessorKey: "id",
            header: "التعريف",
        },
        {
            accessorKey: "typeName",
            header: "اسم النوع",
        },
    ];

    const actions: Action<HouseType>[] = [
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
                <h2 className="text-xl font-bold">أنواع السكن</h2>
                <Button onClick={() => { setSelectedType(null); setIsDialogOpen(true); }} className="gap-2">
                    <Plus className="w-4 h-4" />
                    إضافة نوع
                </Button>
            </div>

            <UniTable
                columns={columns}
                data={houseTypesData?.data || []}
                actions={actions}
                totalItems={houseTypesData?.count || 0}
                itemsPerPage={params.pageSize || 10}
                currentPage={params.pageIndex}
                onPageChange={(page) => setParams(prev => ({ ...prev, pageIndex: page }))}
                isLoading={isLoading}
                tableName="أنواع السكن"
            />

            <AddEditHouseTypeDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                initialData={selectedType}
            />

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                title="حذف نوع السكن"
                description="هل أنت متأكد من حذف نوع السكن هذا؟ لا يمكن التراجع عن هذا الإجراء."
                onConfirm={() => typeToDelete && deleteMutation.mutate(typeToDelete)}
                variant="destructive"
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
