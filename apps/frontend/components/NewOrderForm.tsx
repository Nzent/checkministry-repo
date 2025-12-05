"use client"
import Form from 'next/form'
import { Checkbox } from "./ui/checkbox"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from './ui/button'
import Link from 'next/link'

const NewOrderForm = () => {

    return (
        <div className="w-full">
            <Form action={""} >
                {/* order description */}
                <div className="mb-4">
                    <Input type="text" placeholder="Order Description" />
                </div>
                {/* list of items */}
                <div className='mb-4'>
                    <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked=true:border-blue-600 has-aria-checked=true:bg-blue-50 dark:has-aria-checked=true:border-blue-900 dark:has-aria-checked=true:bg-blue-950">
                        <Checkbox
                            id="toggle-2"
                            defaultChecked
                            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                        />
                        <div className="grid gap-1.5 font-normal">
                            <p className="text-sm leading-none font-medium">
                                HP Laptop
                            </p>
                            <p className="text-muted-foreground text-sm">
                                This is a HP Laptop
                            </p>
                        </div>
                    </Label>
                </div>
                <div className='mb-4'>
                    <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-aria-checked=true:border-blue-600 has-aria-checked=true:bg-blue-50 dark:has-aria-checked=true:border-blue-900 dark:has-aria-checked=true:bg-blue-950">
                        <Checkbox
                            id="toggle-2"
                            defaultChecked
                            className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
                        />
                        <div className="grid gap-1.5 font-normal">
                            <p className="text-sm leading-none font-medium">
                                HP Laptop
                            </p>
                            <p className="text-muted-foreground text-sm">
                                This is a HP Laptop
                            </p>
                        </div>
                    </Label>
                </div>

                {/* buttons */}
                <div className='mt-4 flex justify-end'>
                    <Link href={"/"}>
                        <Button variant="outline" className="mr-4">Cancel</Button>
                    </Link>
                    <Button type="submit">Create Order</Button>
                </div>


            </Form >
        </div>
    )
}

export default NewOrderForm
