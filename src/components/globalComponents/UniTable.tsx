'use client'

import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, type ColumnDef, type SortingState, Row } from '@tanstack/react-table'
import { useState, useEffect } from 'react'
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Edit,
    Trash2,
    Eye,
    RotateCcw,
    Plus,
    Check,
    X,
    ArrowDownToLine
} from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import NoDataMsg from './NoDataMsg'
import { Button } from '@/components/ui/button'

const translations = {
    ar: {
        actions: 'الإجراءات',
        noData: 'لا توجد بيانات',
        noDataDescription: 'لم يتم العثور على أي سجلات.',
        noDataMessage: 'يرجى المحاولة مرة أخرى لاحقاً.',
        of: 'من',
        records: 'سجل',
        page: 'صفحة',
        goToFirstPage: 'الذهاب للصفحة الأولى',
        goToPreviousPage: 'الصفحة السابقة',
        goToNextPage: 'الصفحة التالية',
        goToLastPage: 'الذهاب للصفحة الأخيرة',
        items: 'عناصر',
    }
}

export interface Action<TData> {
    label: string | ((rowData: TData) => string);
    classname?: string | ((rowData: TData) => string);
    onClick: (rowData: TData) => void;
    icon?: React.ElementType;
    show?: (rowData: TData) => boolean;
    disabled?: (rowData: TData) => boolean;
}

interface UniTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    actions?: Action<TData>[];
    tableName?: string;
    filterActions?: (rowData: TData, actions: Action<TData>[]) => Action<TData>[];
    onRowSelect?: (selectedRows: TData[]) => void;
    totalItems: number;
    itemsPerPage: number;
    onPageChange?: (page: number) => void;
    headerActions?: Action<TData>[];
    isLoading?: boolean;
    currentPage?: number;
    onPerPageChange?: (perPage: number) => void;
    onRowClick?: (rowData: TData) => void;
    hidePagination?: boolean;
}

const UniTable = <TData extends object>({
    columns,
    data,
    actions,
    filterActions,
    onRowSelect,
    totalItems,
    itemsPerPage,
    onPageChange,
    headerActions,
    currentPage,
    tableName,
    onRowClick,
    hidePagination = false
}: UniTableProps<TData>) => {
    const locale = 'ar';
    const t = (key: string) => (translations[locale as keyof typeof translations] as any)[key] || key;

    const [rowSelection, setRowSelection] = useState({})
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState({
        pageIndex: currentPage && currentPage > 0 ? currentPage - 1 : 0,
        pageSize: itemsPerPage,
    })

    const getResolvedLabel = (action: Action<TData>, rowData: TData) =>
        typeof action.label === 'function' ? action.label(rowData) : action.label;
    const getResolvedClass = (action: Action<TData>, rowData: TData) =>
        typeof action.classname === 'function' ? action.classname(rowData) : '';

    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            pageSize: itemsPerPage,
        }));
    }, [itemsPerPage]);

    useEffect(() => {
        setPagination(prev => ({
            ...prev,
            pageIndex: (currentPage && currentPage > 0) ? currentPage - 1 : 0,
        }));
    }, [currentPage]);

    const columnsWithSorting = columns.map(column => ({
        ...column,
        enableSorting: column.enableSorting !== false
    }));

    const columnsWithActions = [
        ...(headerActions && headerActions.length > 0 ? [{
            id: 'header-actions',
            header: t('actions'),
            cell: () => (
                <div className="relative flex items-center justify-end gap-2 pr-2">
                    {headerActions?.map((action, index) => {
                        const actionLabel = getResolvedLabel(action, {} as TData);
                        let IconComponent: React.ElementType | null = action.icon || null;

                        if (!IconComponent) {
                            switch (actionLabel) {
                                case 'Add':
                                    IconComponent = Plus;
                                    break;
                                default:
                                    break;
                            }
                        }

                        return (
                            <Tooltip key={index} >
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0 data-[state=open]:bg-muted"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            action.onClick({} as TData);
                                        }}
                                    >
                                        {IconComponent && <IconComponent className={`h-4 w-4 ${actionLabel === 'Delete' ? 'text-red-500' : 'text-primary'}`} />}
                                        <span className="sr-only">{actionLabel}</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>{actionLabel}</TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            ),
            size: 80,
        }] : []),
        ...columnsWithSorting,
        ...(actions && actions.length > 0 ? [{
            id: 'actions',
            header: t('actions'),
            cell: ({ row }: { row: Row<TData> }) => {
                let filteredActions = filterActions
                    ? filterActions(row.original, actions)
                    : actions;

                filteredActions = filteredActions.filter(action => {
                    if (action.show && typeof action.show === 'function') {
                        return action.show(row.original);
                    }
                    return true;
                });

                if (!filteredActions || filteredActions.length === 0) {
                    return null;
                }

                return (
                    <div className="relative flex items-center justify-center gap-2 pr-2">
                        {filteredActions?.map((action, index) => {
                            const actionLabel = getResolvedLabel(action, row.original);
                            const actionClass = getResolvedClass(action, row.original);
                            let IconComponent: React.ElementType | null = action.icon || null;

                            if (!IconComponent) {
                                switch (actionLabel) {
                                    case 'Edit':
                                    case 'تعديل':
                                        IconComponent = Edit;
                                        break;
                                    case 'View':
                                    case 'عرض':
                                        IconComponent = Eye;
                                        break;
                                    case 'Delete':
                                    case 'حذف':
                                        IconComponent = Trash2;
                                        break;
                                    case 'Details':
                                    case 'تفاصيل':
                                    case 'التفاصيل':
                                        IconComponent = Eye;
                                        break;
                                    case 'Restore':
                                    case 'استعادة':
                                        IconComponent = RotateCcw;
                                        break;
                                    case 'Approve':
                                    case 'اعتماد':
                                    case 'وافق':
                                        IconComponent = Check;
                                        break;
                                    case 'Reject':
                                    case 'رفض':
                                        IconComponent = X;
                                        break;
                                    case 'Repay':
                                    case 'استرداد':
                                        IconComponent = ArrowDownToLine;
                                        break;
                                }
                            }

                            return (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className={`h-8 w-8 p-0 data-[state=open]:bg-muted ${actionClass}`}
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                action.onClick(row.original);
                                            }}
                                            disabled={action.disabled ? action.disabled(row.original) : false}
                                        >
                                            {IconComponent && <IconComponent className={`h-4 w-4 ${actionLabel === 'Delete' || actionLabel === 'Refuse' || actionLabel === 'Reject' || actionLabel === 'رفض' ? 'text-red-500' : 'text-primary'}`} />}
                                            <span className="sr-only">{actionLabel}</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>{actionLabel}</TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>
                );
            },
            size: 80,
        }] : []),
    ]

    const table = useReactTable({
        data,
        pageCount: Math.ceil(totalItems / itemsPerPage) || 1,
        state: {
            rowSelection,
            sorting,
            pagination: {
                pageIndex: (currentPage && currentPage > 0) ? currentPage - 1 : 0,
                pageSize: itemsPerPage
            },
        },
        columns: columnsWithActions,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        getRowId: (row: any) => row.id || row.ID || row._id,
    })

    useEffect(() => {
        if (onRowSelect) {
            const selectedRows = table.getSelectedRowModel().rows
            onRowSelect(selectedRows.map(row => row.original))
        }
    }, [rowSelection, onRowSelect, table])

    const hasNoData = !data || data.length === 0

    return (
        <div className="overflow-visible w-full" dir="rtl">
            {hasNoData ? (
                <NoDataMsg
                    title={t('noData')}
                    description={t('noDataDescription')}
                    additionalMessage={t('noDataMessage')}
                />
            ) : (
                <div className="rounded-2xl overflow-x-auto max-w-full shadow-lg border bg-card/50 backdrop-blur-sm">
                    <table className="w-full divide-y divide-border">
                        <thead className="bg-muted/30">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th
                                            key={header.id}
                                            className="p-5 text-sm font-bold text-muted-foreground uppercase tracking-wider text-center"
                                        >
                                            {header.column.getCanSort() ? (
                                                <div
                                                    className="flex items-center justify-center cursor-pointer select-none group gap-2"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    <span className="relative w-4 flex-none">
                                                        {{
                                                            asc: (<ChevronRight className="h-4 w-4 -rotate-90" />),
                                                            desc: (<ChevronRight className="h-4 w-4 rotate-90" />),
                                                        }[header.column.getIsSorted() as string] ?? (
                                                                <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-40 transition-opacity" />
                                                            )}
                                                    </span>
                                                </div>
                                            ) : (
                                                flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-border">
                            {table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className={`hover:bg-primary/5 transition-colors duration-200 ${onRowClick ? 'cursor-pointer' : ''}`}
                                    onClick={() => onRowClick && onRowClick(row.original)}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td
                                            key={cell.id}
                                            className="px-4 md:px-6 py-4 md:py-5 whitespace-nowrap text-sm text-foreground font-medium text-center"
                                        >
                                            {cell.column.id === 'actions' || cell.column.id === 'header-actions' ? (
                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                            ) : (
                                                (cell.getValue() !== undefined && cell.getValue() !== null && cell.getValue() !== '') ? (
                                                    <div className="max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap mx-auto">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground/30">—</span>
                                                )
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {!hidePagination && (
                        <div className="border-t bg-muted/10 py-5 px-8 flex items-center justify-between text-sm text-muted-foreground font-bold flex-wrap gap-4">
                            <span className="flex items-center gap-1">
                                {tableName ? `${tableName}: ` : ''}
                                {data.length} {t('of')} {totalItems} {t('records')}
                            </span>
                            <div className="flex items-center gap-8 rtl:flex-row-reverse">
                                <div className="flex items-center text-sm font-bold">
                                    {t('page')} {currentPage || 1} {t('of')} {Math.ceil(totalItems / itemsPerPage) || 1}
                                </div>
                                <div className="flex items-center gap-2 rtl:flex-row-reverse">
                                    <Button
                                        variant="outline"
                                        className="h-10 w-10 p-0 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                                        onClick={() => onPageChange?.(1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronsRight className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-10 w-10 p-0 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                                        onClick={() => onPageChange?.((currentPage || 1) - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-10 w-10 p-0 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                                        onClick={() => onPageChange?.((currentPage || 1) + 1)}
                                        disabled={currentPage === Math.ceil(totalItems / itemsPerPage) || totalItems === 0}
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="h-10 w-10 p-0 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
                                        onClick={() => onPageChange?.(Math.ceil(totalItems / itemsPerPage) || 1)}
                                        disabled={currentPage === Math.ceil(totalItems / itemsPerPage) || totalItems === 0}
                                    >
                                        <ChevronsLeft className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default UniTable;