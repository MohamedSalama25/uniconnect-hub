import { useState } from "react";
import { Action } from "@/components/globalComponents/UniTable";
import UniTable from "@/components/globalComponents/UniTable";
import { UserDto, UserQueryParams } from "@/features/admin-users/types";
import { AdminUsersStats } from "@/features/admin-users/components/AdminUsersStats";
import { AdminUsersFilter } from "@/features/admin-users/components/AdminUsersFilter";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, UserX, Shield, ShieldAlert, Copy } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAdminUsers } from "@/features/admin-users/hooks/useAdminUsers";
import { useAdminUserMutations } from "@/features/admin-users/hooks/useAdminUserMutations";

export default function AdminUsersPage() {
    const { toast } = useToast();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize] = useState(10);

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

    const { data, isLoading } = useAdminUsers(queryParams);
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
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.profilePictureUrl || ""} alt={user.username} />
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                            <span className="font-medium">
                                {user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.username}
                            </span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
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
                        <Badge key={role} variant="outline" className="text-xs">
                            {role}
                        </Badge>
                    ))}
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "الحالة",
            cell: ({ row }) => {
                const user = row.original;
                if (user.isBlocked) return <Badge variant="destructive">محظور</Badge>;
                if (user.isAccepted) return <Badge className="bg-green-500 hover:bg-green-600">نشط</Badge>;
                return <Badge variant="secondary">معلق</Badge>;
            }
        }
    ];

    const actions: Action<UserDto>[] = [
        {
            label: "نسخ المعرف",
            icon: Copy,
            onClick: (user) => {
                navigator.clipboard.writeText(user.id);
                toast({ title: "تم نسخ المعرف" });
            }
        },
        {
            label: "قبول",
            icon: UserCheck,
            show: (user) => !user.isAccepted,
            onClick: (user) => acceptUser(user.id),
            classname: "text-green-600"
        },
        {
            label: (user) => user.isBlocked ? "فك الحظر" : "حظر",
            icon: UserX,
            onClick: (user) => blockUser(user.id),
            classname: (user) => user.isBlocked ? "text-green-600" : "text-red-600"
        },
        {
            label: (user) => user.roles.includes("Admin") ? "إزالة مشرف" : "تعيين مشرف",
            icon: Shield,
            onClick: (user) => {
                if (user.roles.includes("Admin")) {
                    removeRole({ userId: user.id, role: "Admin" });
                } else {
                    assignRole({ userId: user.id, role: "Admin" });
                }
            },
            classname: "text-blue-600"
        }
    ];

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 bg-muted/30 min-h-screen" dir="rtl">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight">إدارة المستخدمين</h1>
                    <p className="text-muted-foreground">
                        إدارة المستخدمين والأدوار وصلاحيات الوصول.
                    </p>
                </div>

                <AdminUsersStats stats={stats} isLoading={isLoading} />

                <div className="space-y-4">
                    <AdminUsersFilter
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                    />

                    <UniTable
                        columns={columns}
                        data={users}
                        actions={actions}
                        totalItems={totalCount}
                        itemsPerPage={pageSize}
                        currentPage={pageIndex}
                        onPageChange={setPageIndex}
                        tableName="المستخدمين"
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
