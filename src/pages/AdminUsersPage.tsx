import { useState } from "react";
import { Action } from "@/components/globalComponents/UniTable";
import UniTable from "@/components/globalComponents/UniTable";
import { UserDto, UserQueryParams } from "@/features/admin-users/types";
import { AdminUsersStats } from "@/features/admin-users/components/AdminUsersStats";
import { AdminUsersFilter } from "@/features/admin-users/components/AdminUsersFilter";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, UserX, Shield, ShieldAlert, Copy, Eye } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAdminUsers } from "@/features/admin-users/hooks/useAdminUsers";
import { useAdminUserMutations } from "@/features/admin-users/hooks/useAdminUserMutations";
import { ConfirmDialog } from "@/components/globalComponents/ConfirmDialog";
import { AdminUserDetailModal } from "@/features/admin-users/components/AdminUserDetailModal";
import { CustomLoader } from "@/components/ui/loader";

export default function AdminUsersPage() {
    const { toast } = useToast();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(10);
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Confirmation State
    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
        variant?: "destructive" | "warning" | "default";
    }>({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: () => { },
    });

    const openConfirm = (title: string, description: string, onConfirm: () => void, variant: any = "default") => {
        setConfirmState({ isOpen: true, title, description, onConfirm, variant });
    };

    const [filters, setFilters] = useState<{
        search: string;
        role: string;
        status: string;
    }>({
        search: "",
        role: "all",
        status: "all",
    });

    const queryParams: UserQueryParams = {
        pageIndex: pageIndex,
        pageSize: pageSize,
        SearchByNameOrEmail: filters.search || undefined,
        Role: filters.role !== "all" ? filters.role : undefined,
        IsBlocked: filters.status === "blocked" ? true : undefined,
        IsAccepted: filters.status === "pending" ? false : filters.status === "active" ? true : undefined,
    };

    const { data, isLoading, isFetching } = useAdminUsers(queryParams);
    const { acceptUser, blockUser, assignRole, removeRole } = useAdminUserMutations();

    const users = data?.users?.data || [];
    const totalCount = data?.users?.count || 0;

    // Derived stats from the single response
    const stats = {
        totalUsers: data?.totalUsers || 0,
        activeUsers: data?.acceptedUsers || 0,
        blockedUsers: data?.blockedUsers || 0,
        pendingUsers: data?.pendingUsers || 0
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setPageIndex(1); // Reset to first page
    };

    const handleClearFilters = () => {
        setFilters({ search: "", role: "all", status: "all" });
        setPageIndex(1);
    };

    const columns: ColumnDef<UserDto>[] = [
        {
            accessorKey: "username",
            header: "المستخدم",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/10">
                            <AvatarImage src={user.profilePictureUrl || ""} alt={user.username} className="object-cover" />
                            <AvatarFallback className="bg-primary/5 text-primary text-xs">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start text-right">
                            <span className="font-bold text-sm">
                                {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.username}
                            </span>
                            <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                                @{user.username}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            accessorKey: "universityName",
            header: "الجامعة/الكلية",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex flex-col items-center gap-0.5 max-w-[180px]">
                        <span className="text-xs font-bold truncate w-full">{user.universityName || "—"}</span>
                        <span className="text-[10px] text-muted-foreground truncate w-full">{user.collegeName || "—"}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "phonenumber",
            header: "رقم الهاتف",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex flex-col items-center gap-0.5 max-w-[180px]">
                        <span className="text-xs font-bold truncate w-full">{user.phonenumber || "—"}</span>
                    </div>
                );
            }
        },
        {
            accessorKey: "roles",
            header: "الأدوار",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1 justify-center">
                    {row.original.roles.map((role) => (
                        <Badge key={role} variant="secondary" className="text-[10px] py-0 h-5 px-1.5 font-bold whitespace-nowrap">
                            {role === 'Admin' ? 'مشرف' : role === 'Student' ? 'طالب' : role === 'Service' ? 'مقدم خدمة' : role}
                        </Badge>
                    ))}
                </div>
            )
        },
        {
            accessorKey: "isAccepted",
            header: "الحالة",
            cell: ({ row }) => {
                const user = row.original;
                if (user.isBlocked) return <Badge variant="destructive" className="bg-rose-500/10 text-rose-600 border border-rose-200/50 hover:bg-rose-500/20 h-6 px-2 text-[10px] font-bold shadow-none">محظور</Badge>;
                if (user.isAccepted) return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border border-emerald-200/50 hover:bg-emerald-500/20 h-6 px-2 text-[10px] font-bold shadow-none">نشط</Badge>;
                return <Badge variant="outline" className="h-6 px-2 text-[10px] font-bold text-amber-600 border-amber-200 bg-amber-500/10 hover:bg-amber-500/20 shadow-none border-none">معلق</Badge>;
            }
        }
    ];

    const actions: Action<UserDto>[] = [
        {
            label: "عرض التفاصيل",
            icon: Eye,
            onClick: (user) => {
                setSelectedUser(user);
                setIsDetailOpen(true);
            },
            classname: "text-blue-500"
        },
        {
            label: "قبول المستخدم",
            icon: UserCheck,
            show: (user) => !user.isAccepted,
            onClick: (user) => {
                openConfirm(
                    "تأكيد قبول المستخدم",
                    `هل أنت متأكد من رغبتك في قبول الطلب الخاص بـ ${user.firstName || user.username}؟ سيتمكن من استخدام كافة مميزات المنصة.`,
                    () => acceptUser(user.id),
                    "default"
                );
            },
            classname: "text-green-600"
        },
        {
            label: (user) => user.isBlocked ? "فك الحظر" : "حظر المستخدم",
            icon: UserX,
            onClick: (user) => {
                openConfirm(
                    user.isBlocked ? "تأكيد فك الحظر" : "تأكيد حظر المستخدم",
                    user.isBlocked
                        ? `هل أنت متأكد من فك الحظر عن ${user.username}؟`
                        : `هل أنت متأكد من رغبتك في حظر ${user.username}؟ لن يتمكن من الوصول إلى حسابه.`,
                    () => blockUser({ userId: user.id, isBlocked: !user.isBlocked }),
                    user.isBlocked ? "default" : "destructive"
                );
            },
            classname: (user) => user.isBlocked ? "text-green-600" : "text-red-600"
        },
        {
            label: (user) => user.roles.includes("Admin") ? "إزالة صلاحية مشرف" : "تعيين كمشرف",
            icon: Shield,
            onClick: (user) => {
                const isAdmin = user.roles.includes("Admin");
                openConfirm(
                    isAdmin ? "إزالة صلاحية مدير" : "تعيين كمدير للنظام",
                    isAdmin
                        ? `هل أنت متأكد من إزالة صلاحيات الإدارة عن ${user.username}؟`
                        : `هل أنت متأكد من تعيين ${user.username} كمشرف للنظام؟ سيكون له كامل الصلاحيات.`,
                    () => {
                        if (isAdmin) {
                            removeRole({ username: user.username, role: "Admin" });
                        } else {
                            assignRole({ username: user.username, role: "Admin" });
                        }
                    },
                    isAdmin ? "warning" : "default"
                );
            },
            classname: "text-amber-600"
        },
        {
            label: (user) => user.roles.includes("Service") ? "إزالة مقدم خدمة" : "تعيين مقدم خدمة",
            icon: ShieldAlert,
            onClick: (user) => {
                const isService = user.roles.includes("Service");
                openConfirm(
                    isService ? "إزالة دور مقدم الخدمة" : "تعيين كمقدم خدمة",
                    isService
                        ? `هل أنت متأكد من إزالة دور مقدم الخدمة عن ${user.username}؟`
                        : `هل أنت متأكد من تعيين ${user.username} كمقدم خدمة؟`,
                    () => {
                        if (isService) {
                            removeRole({ username: user.username, role: "Service" });
                        } else {
                            assignRole({ username: user.username, role: "Service" });
                        }
                    },
                    isService ? "warning" : "default"
                );
            },
            classname: "text-purple-600"
        }
    ];

    return (
        <DashboardLayout>
            <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-muted/30 " dir="rtl">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">إدارة المستخدمين</h1>
                    <p className="text-muted-foreground text-sm md:text-base">
                        إدارة المستخدمين والأدوار وصلاحيات الوصول.
                    </p>
                </div>

                <div className="w-full overflow-hidden">
                    <AdminUsersStats stats={stats} isLoading={isLoading} />
                </div>

                <div className="space-y-6">
                    <AdminUsersFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />

                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <UniTable
                            columns={columns}
                            data={users}
                            actions={actions}
                            totalItems={totalCount}
                            itemsPerPage={pageSize}
                            currentPage={pageIndex}
                            onPageChange={setPageIndex}
                            tableName="المستخدمين"
                            isLoading={isLoading || isFetching}
                        />
                    </div>
                </div>
            </div>

            <AdminUserDetailModal
                user={selectedUser}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />

            <ConfirmDialog
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                onConfirm={() => {
                    confirmState.onConfirm();
                    setConfirmState(prev => ({ ...prev, isOpen: false }));
                }}
                title={confirmState.title}
                description={confirmState.description}
                variant={confirmState.variant}
            />
        </DashboardLayout>
    );
}
