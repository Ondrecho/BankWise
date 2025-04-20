// src/components/shared/DataTable.tsx
'use client';
import {ReactNode, useState} from 'react';
import {cn} from "@/lib/utils/uiUtils";

export interface DataTableColumn<T> {
    header: string;
    accessor: keyof T;
    render?: (value: any, row: T, utils: { isExpanded: boolean; toggleExpand: () => void }) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    onRowClick?: (item: T) => void;
    actions?: (item: T) => ReactNode;
}

export function DataTable<T extends { id: number }>({
                                                        data,
                                                        columns,
                                                        onRowClick,
                                                        actions,
                                                    }: DataTableProps<T>) {
    const [expandedRowIds, setExpandedRowIds] = useState<number[]>([]);
    const isRowExpanded = (id: number) => expandedRowIds.includes(id);
    const toggleRow = (id: number) =>
        setExpandedRowIds((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );

    return (
        <div className="w-full">
            <table className="table-fixed w-full border-collapse">
                <thead className="bg-white sticky top-0 z-10 shadow-sm">
                <tr>
                    {columns.map((column) => (
                        <th
                            key={String(column.accessor)}
                            className="p-4 text-left align-middle text-sm font-medium text-muted-foreground whitespace-nowrap"
                        >
                            {column.header}
                        </th>
                    ))}
                    {actions && (
                        <th className="p-4 text-center text-sm font-medium text-muted-foreground">
                            Actions
                        </th>
                    )}
                </tr>
                </thead>
            </table>

            <div className="max-h-[500px] overflow-y-auto w-full">
                <table className="table-fixed w-full border-collapse">
                    <tbody>
                    {data.map((item) => (
                        <tr
                            key={item.id}
                            className={cn(
                                "border-b transition-colors hover:bg-muted/50",
                                onRowClick && "cursor-pointer"
                            )}
                            onClick={() => onRowClick?.(item)}
                        >
                            {columns.map((column) => {
                                const value = item[column.accessor];
                                return (
                                    <td
                                        key={String(column.accessor)}
                                        className="p-4 align-middle break-words whitespace-normal text-sm"
                                    >
                                        {column.render
                                            ? column.render(value, item, {
                                                isExpanded: isRowExpanded(item.id),
                                                toggleExpand: () => toggleRow(item.id),
                                            })
                                            : String(value)}
                                    </td>
                                );
                            })}
                            {actions && (
                                <td className="p-4 text-center">{actions(item)}</td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
