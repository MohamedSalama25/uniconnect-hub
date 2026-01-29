import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import UniTable, { Action } from "@/components/globalComponents/UniTable";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppointments, useDeleteAppointment, useUpdateAppointment } from "../hooks/useAppointments";
import { Appointment, AppointmentStatus } from "../services/appointment.service";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { formatDate, cn, formatImageUrl } from "@/lib/utils";
import {
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    User,
    Home,
    Edit,
    Trash2,
    Eye,
    Check,
    X,
    Loader,
    Phone,
    Wallet,
    Users,
    CalendarDays,
    MessageSquare
} from "lucide-react";
import { BookingDialog } from "../components/BookingDialog";
import { BookingDetailsDialog } from "../components/BookingDetailsDialog";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";
import StatsCard from "@/components/globalComponents/StatsCard";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const BookingsTemplate = () => {
    const { user, fullProfile } = useAuthStore();
    const currentUserId = fullProfile?.id || (user as any)?.id;

    // Pagination & Filtering State
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'All'>('All');

    const { data: appointmentsResponse, isLoading, isFetching } = useAppointments({
        pageIndex,
        pageSize,
    });

    const updateMutation = useUpdateAppointment();
    const deleteMutation = useDeleteAppointment();

    // Dialog States
    const [editingBooking, setEditingBooking] = useState<Appointment | null>(null);
    const [viewingBooking, setViewingBooking] = useState<Appointment | null>(null);
    const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
    const [processingId, setProcessingId] = useState<number | null>(null);

    // Unified Dashboard Integration:
    // - Route Synchronization: Updated `/provider/bookings` to use the same dynamic `BookingsTemplate` as the user booking page, ensuring consistency across all user types.
    // - Dynamic Data Flow: Fixed an issue where legacy pages were still displaying mock data; now all booking-related views consume real-time database entries via the centralized `useAppointments` hook.
    // - Real-time Stats: Dashboard statistics (Revenue, Counts) are now 100% server-calculated and dynamic.

    // Stats from Server
    const stats = {
        expectedRevenue: appointmentsResponse?.expectedRevenue || 0,
        currentTenants: appointmentsResponse?.confirmedAppointments || 0,
        pendingBookings: appointmentsResponse?.pendingAppointments || 0,
        totalBookings: appointmentsResponse?.totalAppointments || 0,
    };

    // Table Data
    const tableData = appointmentsResponse?.data || [];

    // Logic for filtering by client-side if needed, but per requirements we should try to match
    // the status filter. If backend doesn't support it yet as a query param, we filter here.
    const displayData = useMemo(() => {
        if (filterStatus === 'All') return tableData;
        return tableData.filter(app => app.status === filterStatus);
    }, [tableData, filterStatus]);

    const handleStatusUpdate = async (appointment: Appointment, status: AppointmentStatus) => {
        setProcessingId(appointment.id);
        updateMutation.mutate({
            id: appointment.id,
            data: {
                status,
                appointmentDate: appointment.appointmentDate?.split('T')[0],
                appointmentTime: appointment.appointmentTime,
                tenantMessage: appointment.tenantMessage,
                ownerResponseMessage: appointment.ownerResponseMessage
            }
        }, {
            onSuccess: () => {
                toast.success(status === 'Accepted' ? "تم قبول الطلب بنجاح" : "تم رفض الطلب");
                setProcessingId(null);
            },
            onError: () => setProcessingId(null)
        });
    };

    const handleDelete = () => {
        if (!bookingToDelete) return;
        deleteMutation.mutate(bookingToDelete, {
            onSuccess: () => setBookingToDelete(null),
        });
    };

    const statusMap: Record<AppointmentStatus, { label: string, color: string, icon: any }> = {
        Pending: { label: "قيد المراجعة", color: "bg-amber-500/10 text-amber-600", icon: Clock },
        Accepted: { label: "تم القبول", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
        Rejected: { label: "تم الرفض", color: "bg-rose-500/10 text-rose-600", icon: XCircle },
        Cancelled: { label: "ملغي", color: "bg-gray-500/10 text-gray-600", icon: XCircle },
    };

    const columns: ColumnDef<Appointment>[] = [
        {
            accessorKey: "tenantName",
            header: "المستأجر",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/10">
                        <AvatarImage src={formatImageUrl(row.original.tenantPhotoUrl)} />
                        <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                            {row.original.tenantName?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-right">
                        <span className="font-bold text-sm">{row.original.tenantName}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{row.original.tenantPhone}</span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "houseName",
            header: "الوحدة",
            cell: ({ row }) => (
                <div className="flex flex-col items-center max-w-[200px]">
                    <span className="text-sm font-bold truncate w-full">{row.original.houseName}</span>
                </div>
            )
        },
        {
            accessorKey: "createdAt",
            header: "تاريخ الطلب",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-muted-foreground">{formatDate(row.original.createdAt)}</span>
            )
        },
        {
            accessorKey: "housePrice",
            header: "المبلغ",
            cell: ({ row }) => (
                <span className="text-sm font-bold text-primary">
                    {(row.original.housePrice || 0).toLocaleString()} ج.م
                </span>
            )
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => {
                const status = row.original.status as AppointmentStatus;
                const config = statusMap[status] || statusMap.Pending;
                if (status === 'Accepted')
                    return <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none h-6 px-3 text-[10px] font-bold shadow-none">نشط</Badge>;
                if (status === 'Pending')
                    return <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-none h-6 px-3 text-[10px] font-bold shadow-none">معلق</Badge>;
                if (status === 'Rejected' || status === 'Cancelled')
                    return <Badge className="bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 border-none h-6 px-3 text-[10px] font-bold shadow-none">ملغي</Badge>;
                return <Badge className={cn("h-6 px-3 text-[10px] font-bold shadow-none border-none", config.color)}>{config.label}</Badge>;
            }
        }
    ];

    const actions: Action<Appointment>[] = [
        {
            label: "عرض التفاصيل",
            icon: Eye,
            onClick: (row) => setViewingBooking(row),
            classname: "text-blue-500"
        },
        {
            label: "رد على الطلب",
            icon: MessageSquare,
            show: (row) => String(row.ownerId) === String(currentUserId) &&
                (row.status === 'Pending' || row.status === 'Accepted') &&
                !row.ownerResponseMessage,
            onClick: (row) => setViewingBooking(row),
            classname: "text-indigo-600"
        },
        {
            label: "قبول الطلب",
            icon: CheckCircle2,
            show: (row) => String(row.ownerId) === String(currentUserId) && row.status === 'Pending',
            disabled: (row) => processingId === row.id,
            onClick: (row) => handleStatusUpdate(row, 'Accepted'),
            classname: "text-green-600"
        },
        {
            label: "رفض الطلب",
            icon: XCircle,
            show: (row) => String(row.ownerId) === String(currentUserId) && row.status === 'Pending',
            disabled: (row) => processingId === row.id,
            onClick: (row) => handleStatusUpdate(row, 'Rejected'),
            classname: "text-red-500"
        },
        {
            label: "تعديل",
            icon: Edit,
            onClick: (row) => setEditingBooking(row),
            show: (row) => String(row.tenantId) === String(currentUserId) && row.status === 'Pending',
            classname: "text-amber-600"
        },
        {
            label: "إلغاء",
            icon: Trash2,
            onClick: (row) => setBookingToDelete(row.id),
            show: (row) => String(row.tenantId) === String(currentUserId) && row.status === 'Pending',
            classname: "text-red-600"
        }
    ];

    // Reactive viewing booking to catch updates (like owner response)
    const reactiveViewingBooking = useMemo(() => {
        if (!viewingBooking) return null;
        return appointmentsResponse?.data.find(a => a.id === viewingBooking.id) || viewingBooking;
    }, [appointmentsResponse, viewingBooking]);

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-muted/30 " dir="rtl">

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة الحجوزات</h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        متابعة طلبات الحجز الخاصة بوحداتك السكنية وإدارة المواعيد.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="إجمالي الحجوزات"
                        value={stats.totalBookings}
                        icon={CalendarDays}
                        description="إجمالي الطلبات المستلمة"
                        variant="blue"
                        isLoading={isLoading}
                    />
                    <StatsCard
                        title="المستأجرين الحاليين"
                        value={stats.currentTenants}
                        icon={User}
                        description="حجوزات مؤكدة"
                        variant="green"
                        isLoading={isLoading}
                    />
                    <StatsCard
                        title="بانتظار الموافقة"
                        value={stats.pendingBookings}
                        icon={Clock}
                        description="طلبات جديدة"
                        variant="amber"
                        isLoading={isLoading}
                    />
                    <StatsCard
                        title="الإيرادات المتوقعة"
                        value={`${stats.expectedRevenue.toLocaleString()} ج.م`}
                        icon={Wallet}
                        description="من الحجوزات النشطة"
                        variant="primary"
                        isLoading={isLoading}
                    />
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-2">
                        {(['All', 'Pending', 'Accepted', 'Rejected'] as const).map((status) => (
                            <Button
                                key={status}
                                variant={filterStatus === status ? "default" : "outline"}
                                onClick={() => setFilterStatus(status)}
                                className={cn(
                                    "rounded-xl h-9 px-4 text-xs font-bold",
                                    filterStatus === status ? "shadow-sm" : ""
                                )}
                            >
                                {status === 'All' ? 'الكل' : statusMap[status]?.label}
                            </Button>
                        ))}
                    </div>

                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <UniTable
                            columns={columns}
                            data={displayData}
                            actions={actions}
                            totalItems={appointmentsResponse?.count || 0}
                            itemsPerPage={pageSize}
                            currentPage={pageIndex}
                            onPageChange={setPageIndex}
                            tableName="الحجوزات"
                            isLoading={isLoading || isFetching}
                        />
                    </div>
                </div>

                {/* Dialogs */}
                <BookingDialog
                    open={!!editingBooking}
                    onOpenChange={(open) => !open && setEditingBooking(null)}
                    initialData={editingBooking || undefined}
                />
                <BookingDetailsDialog
                    open={!!viewingBooking}
                    onOpenChange={(open) => !open && setViewingBooking(null)}
                    booking={reactiveViewingBooking}
                    isOwner={reactiveViewingBooking ? String(reactiveViewingBooking.ownerId) === String(currentUserId) : false}
                />
                <ConfirmDialog
                    isOpen={!!bookingToDelete}
                    onClose={() => setBookingToDelete(null)}
                    onConfirm={handleDelete}
                    title="تأكيد إلغاء الطلب"
                    description="هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟"
                    variant="destructive"
                    confirmText="تأكيد الإلغاء"
                    cancelText="تراجع"
                    isLoading={deleteMutation.isPending}
                />
            </div>
        </DashboardLayout>
    );
};
