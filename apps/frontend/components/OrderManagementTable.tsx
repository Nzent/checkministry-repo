"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { IconCopy, IconPencil, IconTrashX } from "@tabler/icons-react"
import Link from "next/link"



export type IOrder = {
    order_id: number
    order_description: string
    count_of_products: number
    created_date: string
}
const data: IOrder[] = [
    {
        order_id: 1,
        order_description: "Order for Customer 1",
        count_of_products: 3,
        created_date: "2024-06-01",
    },
    {
        order_id: 2,
        order_description: "Order for Customer 2",
        count_of_products: 5,
        created_date: "2024-06-03",
    },
    {
        order_id: 3,
        order_description: "Order for Self",
        count_of_products: 2,
        created_date: "2024-06-05",
    },
    {
        order_id: 4,
        order_description: "Order for Customer 3",
        count_of_products: 4,
        created_date: "2024-06-07",
    },
    {
        order_id: 5,
        order_description: "Bulk Order for Customer 4",
        count_of_products: 10,
        created_date: "2024-06-10",
    },
    {
        order_id: 6,
        order_description: "Order for Customer 5",
        count_of_products: 1,
        created_date: "2024-06-12",
    },
    {
        order_id: 7,
        order_description: "Replacement Order for Customer 2",
        count_of_products: 2,
        created_date: "2024-06-14",
    },
    {
        order_id: 8,
        order_description: "Order for Customer 6",
        count_of_products: 6,
        created_date: "2024-06-16",
    },
    {
        order_id: 9,
        order_description: "Test Order",
        count_of_products: 3,
        created_date: "2024-06-18",
    },
    {
        order_id: 10,
        order_description: "Order for Customer 7",
        count_of_products: 8,
        created_date: "2024-06-20",
    },
];


export const columns: ColumnDef<IOrder> = [
    // select
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    //   order id
    {
        accessorKey: "order_id",
        header: "Order ID",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("order_id")}</div>
        ),
    },
    //   order description
    {
        accessorKey: "order_description",
        header: "Order Description",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("order_description")}</div>
        ),
    },
    //   count of products
    {
        accessorKey: "count_of_products",
        header: "Count of Products",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("count_of_products")}</div>
        ),
    },
    //   created date
    {
        accessorKey: "created_date",
        header: "Created Date",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("created_date")}</div>
        ),
    },
    //   actions
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const payment = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            <IconCopy /> Copy Order ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                        >
                            <IconPencil /> Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500"><IconTrashX className="text-red-500" /> Delete Order</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function OrderManagementTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter by order id or description..."
                    value={(table.getColumn("order_id")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("order_id")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                {/* columns */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* new order button */}
                <Link href="/new-order">
                    <Button className="ml-4">New Order</Button>
                </Link>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
