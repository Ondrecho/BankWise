// src/components/shared/DataTable.tsx
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {ReactNode, useState} from 'react';

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
        <div className="overflow-hidden">
            <Table className="min-w-full">
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={String(column.accessor)} className={column.header === 'Accounts' || column.header === 'Actions' ? 'text-center' : ''}>
                                {column.header}
                            </TableHead>
                        ))}
                        {actions && <TableHead className="text-center pr-10">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
            </Table>

            <div className="max-h-[500px] overflow-y-auto">
                <Table className="min-w-full table-fixed">
                    <TableBody>
                        {data.map((item, index) => (
                            <TableRow
                                key={index}
                                className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((column) => {
                                    const value = item[column.accessor];
                                    const cellClass = column.header === 'Accounts' || column.header === 'Actions' ? 'text-center' : '';
                                    return (
                                        <TableCell key={String(column.accessor)} className={cellClass}>
                                            {column.render
                                                ? column.render(value, item, {
                                                    isExpanded: expandedRowIds.includes(item.id),
                                                    toggleExpand: () =>
                                                        setExpandedRowIds((prev) =>
                                                            prev.includes(item.id)
                                                                ? prev.filter((id) => id !== item.id)
                                                                : [...prev, item.id]
                                                        ),
                                                })
                                                : String(value)}
                                        </TableCell>
                                    );
                                })}

                                {actions && (
                                    <TableCell className="text-center">{actions(item)}</TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
