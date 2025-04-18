// src/components/shared/DataTable.tsx
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReactNode } from 'react';

export interface DataTableColumn<T> {
    header: string;
    accessor: keyof T;
    render?: (value: any, row: T) => ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: DataTableColumn<T>[];
    onRowClick?: (item: T) => void;
    actions?: (item: T) => ReactNode;
}

export function DataTable<T>({ data, columns, onRowClick, actions }: DataTableProps<T>) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((column) => (
                        <TableHead key={String(column.accessor)}>{column.header}</TableHead>
                    ))}
                    {actions && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow
                        key={index}
                        className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                        onClick={() => onRowClick?.(item)}
                    >
                        {columns.map((column) => {
                            const value = item[column.accessor];
                            return (
                                <TableCell key={String(column.accessor)}>
                                    {column.render
                                        ? column.render(value, item)
                                        : String(value)}
                                </TableCell>
                            );
                        })}
                        {actions && <TableCell className="text-right">{actions(item)}</TableCell>}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}