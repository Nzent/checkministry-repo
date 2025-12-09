"use client"
"use no memo"

import { useState } from "react"
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
import { AlertCircle, ChevronDown, MoreHorizontal } from "lucide-react"

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
import { Button } from "@/components/ui/button"
import { useDeleteOrder, useOrders } from "@/hooks/useOrders"
import { IOrder } from "@/types/order"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { DialogHeader, DialogFooter } from "../ui/dialog"

export function OrderManagementTable() {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] =
        useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const [orderToDelete, setOrderToDelete] = useState<number | null>(null)
    const { data: Orders, isLoading, error, isError } = useOrders();
    const deleteOrderMutation = useDeleteOrder();

    const [globalFilter, setGlobalFilter] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const tableData = Orders || []

    const columns: ColumnDef<IOrder>[] = [
        // order id
        {
            accessorKey: "Id",
            header: "Order ID",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("Id")}</div>
            ),
        },
        // order description
        {
            accessorKey: "orderDescription",
            header: "Order Description",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("orderDescription")}</div>
            ),
        },
        // count of products
        {
            accessorKey: "countOfProducts",
            header: "Count of Products",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("countOfProducts")}</div>
            ),
        },
        // created date
        {
            accessorKey: "createdAt",
            header: "Created Date",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("createdAt")}</div>
            ),
        },
        // actions
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const order = row

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
                                onClick={() => navigator.clipboard.writeText(order.getValue("Id"))}
                            >
                                <IconCopy /> Copy Order ID
                            </DropdownMenuItem>
                            <Link href={"/update-order/" + order.getValue("Id")}>
                                <DropdownMenuItem>
                                    <IconPencil /> Edit Order
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(order.getValue("Id"))}>
                                <IconTrashX className="text-red-500" /> Delete Order
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data: tableData,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        globalFilterFn: (row, columnId, filterValue) => {
            const searchValue = filterValue.toLowerCase()
            const orderId = String(row.getValue("Id")).toLowerCase()
            const orderDescription = String(row.getValue("orderDescription")).toLowerCase()

            return orderId.includes(searchValue) || orderDescription.includes(searchValue)
        },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter
        },
    })

    const handleDelete = (id: number) => {
        setOrderToDelete(id)
        setIsDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!orderToDelete) return

        deleteOrderMutation.mutate({ id: orderToDelete }, {
            onSuccess: () => {
                console.log('Order deleted successfully')
                setIsDialogOpen(false)
                setOrderToDelete(null)
            },
            onError: (error) => {
                console.error('Failed to delete order:', error)
            }
        })
    }

    return (
        <>
            <div className="w-full">
                <div className="flex items-center py-4">
                    <Input
                        placeholder="Filter by order id or description..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
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
                    {isLoading && <div className="p-4">Loading...</div>}
                    {isError && (
                        <Alert variant="default">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error!</AlertTitle>
                            <AlertDescription>
                                {error.message}
                            </AlertDescription>
                        </Alert>
                    )}
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete order {orderToDelete}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleteOrderMutation.isPending}
                        >
                            {deleteOrderMutation.isPending ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}