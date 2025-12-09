"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useParams, useRouter } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2Icon, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useOrder, useProducts, useUpdateOrder } from '@/hooks/useOrders'
import { useEffect } from 'react'

// Form validation schema
const formSchema = z.object({
    orderDescription: z.string().min(1, 'Order description is required').max(100, 'Maximum 100 characters'),
    productIds: z.array(z.number()).optional().default([]),
})

type FormData = z.infer<typeof formSchema>

const UpdateOrderForm = () => {
    const router = useRouter()
    const { id } = useParams()

    const { data: products, isLoading: productsLoading, error: productsError } = useProducts()
    const { data: orderData, isLoading: orderLoading } = useOrder(Number(id))
    const updateOrderMutation = useUpdateOrder()

    console.log(orderData);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            orderDescription: '',
            productIds: [],
        },
    })

    // Update form when order data loads
    useEffect(() => {
        if (orderData) {
            reset({
                orderDescription: orderData.orderDescription || '',
                // Extract product IDs from products array
                productIds: orderData.products?.map(product => product.Id) || [],
            })
        }
    }, [orderData, reset])

    // Just watch the form value - no separate state needed
    const selectedProducts = watch('productIds') || []

    // Handle product selection
    const handleProductToggle = (productId: number) => {
        const newSelectedProducts = selectedProducts.includes(productId)
            ? selectedProducts.filter(id => id !== productId)
            : [...selectedProducts, productId]

        setValue('productIds', newSelectedProducts, { shouldDirty: true })
    }

    // Handle select all products
    const handleSelectAll = () => {
        if (!products) return

        const allProductIds = products.map(product => product.Id)
        const newSelectedProducts = selectedProducts.length === products.length ? [] : allProductIds

        setValue('productIds', newSelectedProducts, { shouldDirty: true })
    }

    // Handle form submission
    const onSubmit = async (data: FormData) => {
        try {
            const result = await updateOrderMutation.mutateAsync({
                id: Number(id),
                data: {
                    orderDescription: data.orderDescription,
                    productIds: selectedProducts
                }
            })

            console.log('Order updated:', result)
        } catch (error) {
            console.error('Failed to update order:', error)
        }
    }

    // Show loading state while fetching order or products
    if (orderLoading || productsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading...</span>
            </div>
        )
    }

    if (productsError) {
        return (
            <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Failed to load products. Please try again.
                </AlertDescription>
            </Alert>
        )
    }

    if (!orderData) {
        return (
            <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Order not found.
                </AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-6 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Update Order #{id}</CardTitle>
                    <CardDescription>
                        Modify the order description and selected products
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Order Description */}
                        <div className="space-y-2">
                            <Label htmlFor="orderDescription">
                                Order Description <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="orderDescription"
                                placeholder="e.g., Order for Customer 1"
                                {...register('orderDescription')}
                                className={errors.orderDescription ? 'border-red-500' : ''}
                                disabled={updateOrderMutation.isPending}
                            />
                            {errors.orderDescription && (
                                <p className="text-sm text-red-500">{errors.orderDescription.message}</p>
                            )}
                        </div>

                        {/* Products Selection */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label>Select Products</Label>
                                {products && products.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSelectAll}
                                        disabled={updateOrderMutation.isPending}
                                    >
                                        {selectedProducts.length === products.length ? 'Deselect All' : 'Select All'}
                                    </Button>
                                )}
                            </div>

                            {!products || products.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No products available
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {products.map((product) => (
                                        <div
                                            key={product.Id}
                                            className={`flex items-start gap-3 rounded-lg border p-3 transition-colors cursor-pointer ${selectedProducts.includes(product.Id)
                                                    ? 'border-blue-600 bg-blue-50 dark:border-blue-900 dark:bg-blue-950'
                                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-800'
                                                }`}
                                            onClick={() => handleProductToggle(product.Id)}
                                        >
                                            <div className="grid gap-1.5 font-normal flex-1">
                                                <Label
                                                    htmlFor={`product-${product.Id}`}
                                                    className="text-sm leading-none font-medium cursor-pointer"
                                                >
                                                    {product.productName}
                                                </Label>
                                                <p className="text-muted-foreground text-sm">
                                                    {product.productDescription}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Error Alert */}
                        {updateOrderMutation.isError && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Failed!</AlertTitle>
                                <AlertDescription>
                                    Failed to update order. Please try again.
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Success alert */}
                        {updateOrderMutation.isSuccess && (
                            <Alert variant="default">
                                <CheckCircle2Icon className="h-4 w-4" />
                                <AlertTitle>Updated!</AlertTitle>
                                <AlertDescription>
                                    Order updated successfully!
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/')}
                                disabled={updateOrderMutation.isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={updateOrderMutation.isPending || selectedProducts.length === 0}
                            >
                                {updateOrderMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Order'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default UpdateOrderForm