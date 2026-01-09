import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import UniTable, { Action } from "@/components/globalComponents/UniTable";
import { StatCard } from "@/components/cards/StatCard";
import { Users, CalendarCheck, Clock, Wallet } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { mockBookings, Booking } from "../data/mockBookings";
import { useNavigate } from "react-router-dom";

export const ProviderBookingsTemplate = () => {
    const navigate = useNavigate();

    // Columns Configuration
    const columns: ColumnDef<Booking>[] = [
        {
            accessorKey: "user",
            header: "المستأجر",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={row.original.user.avatar} />
                        <AvatarFallback>{row.original.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-right">
                        <div className="font-bold text-sm">{row.original.user.name}</div>
                        <div className="text-xs text-muted-foreground">{row.original.user.phone}</div>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "accommodation.title",
            header: "الوحدة",
            cell: ({ row }) => (
                <div className="font-medium text-sm text-right px-2">
                    {row.original.accommodation.title}
                </div>
            )
        },
        {
            accessorKey: "date",
            header: "تاريخ الطلب",
            cell: ({ row }) => <span className="text-muted-foreground font-mono text-sm">{row.original.date}</span>
        },
        {
            accessorKey: "amount",
            header: "المبلغ",
            cell: ({ row }) => <span className="font-bold text-primary">{row.original.amount} ج.م</span>
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge variant={status === 'confirmed' ? 'default' : status === 'pending' ? 'secondary' : 'destructive'}
                        className={status === 'confirmed' ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {status === 'confirmed' ? 'مؤكد' : status === 'pending' ? 'قيد الانتظار' : 'مرفوض'}
                    </Badge>
                );
            }
        }
    ];

    // Actions
    const actions: Action<Booking>[] = [
        {
            label: "تفاصيل",
            onClick: (row) => navigate(`/provider/booking/${row.id}`),
        },
        {
            label: "قبول",
            icon: CalendarCheck,
            onClick: (row) => toast.success(`تم قبول حجز ${row.user.name}`),
            show: (row) => row.status === 'pending'
        },
        {
            label: "رفض",
            onClick: (row) => toast.error(`تم رفض حجز ${row.user.name}`),
            show: (row) => row.status === 'pending'
        }
    ];

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-fade-in relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">إدارة الحجوزات</h1>
                        <p className="text-muted-foreground">تابع طلبات الحجز الخاصة بوحداتك السكنية.</p>
                    </div>
                    {/* <Button>تصدير التقرير</Button> */}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard
                        title="إجمالي الحجوزات"
                        value={125}
                        icon={CalendarCheck}
                        variant="primary"
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatCard
                        title="قيد الانتظار"
                        value={4}
                        icon={Clock}
                        variant="accent"
                    />
                    <StatCard
                        title="المستأجرين الحاليين"
                        value={89}
                        icon={Users}
                    />
                    <StatCard
                        title="الإيرادات المتوقعة"
                        value="45,200"
                        icon={Wallet}
                        variant="success"
                        trend={{ value: 8, isPositive: true }}
                    />
                </div>

                {/* Table */}
                <UniTable
                    columns={columns}
                    data={mockBookings}
                    actions={actions}
                    tableName="سجل الحجوزات"
                    itemsPerPage={5}
                    totalItems={mockBookings.length}
                    onPageChange={() => { }}
                />
            </div>
        </DashboardLayout>
    );
};
