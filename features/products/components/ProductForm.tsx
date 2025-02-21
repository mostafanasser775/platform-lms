'use client'

import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RequiredLabelIcon } from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { actionToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { productSchema } from "../schema/products";
import { ProdcutStatus, productStatuses } from "@/drizzle/schema/product";
import { createProductAction, updateProductAction } from "../actions/product";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/custom/multi-select";
import { Button } from "@heroui/button";
import ImageUpload from "@/components/ImageUpload";
export function ProductForm({ product, courses }: {
    product?: {
        id: string,
        name: string,
        description: string,
        imageUrl: string,
        priceInDollars: number,
        status: ProdcutStatus,
        //  courseCount: number
        // customersCount: number,
        courseIds: string[]
    },
    courses: { id: string, name: string }[]
}) {
    const router = useRouter()
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: product ?? {
            name: '',
            description: '',
            courseIds: [],
            priceInDollars: 0,
            imageUrl: '',
            status: "private",
        },
    })
    async function onSubmit(values: z.infer<typeof productSchema>) {
        const action = product == null ? createProductAction : updateProductAction.bind(null, product.id)
        const result = await action(values)
        if (result.error === false)
            router.refresh()
        actionToast({ toastData: result });
    }
    return (
        <div>
            <Form {...form}>
                <form className='flex flex-col gap-4' onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 items-start">
                        <FormField control={form.control} name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <RequiredLabelIcon />
                                    <FormControl>
                                        <Input {...field} className="border-gray-300 rounded-md" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="priceInDollars"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <RequiredLabelIcon />
                                    <FormControl>
                                        <Input type="number" step={1} min={0}{...field}
                                            onChange={(e) => field.onChange(isNaN(e.target.valueAsNumber) ? "" : e.target.valueAsNumber)}
                                            className="border-gray-300 rounded-md" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control} name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <RequiredLabelIcon />
                                    <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                                        <FormControl>
                                            <SelectTrigger className="border-gray-300 rounded-md">
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent> {
                                            productStatuses.map((status) =>
                                                <SelectItem key={status} value={status}>{status}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control} name="courseIds"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Included Courses</FormLabel>
                                    <RequiredLabelIcon />
                                    <FormControl>
                                        <MultiSelect selectPlaceholder='Select Courses'
                                            searchPlaceholder="Select Courses"
                                            options={courses}
                                            getLabel={(c) => c.name} getValue={(c) => c.id}
                                            selectedValues={field.value}
                                            onSelectedValuesChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image</FormLabel>
                                    <RequiredLabelIcon />
                                    <FormControl>
                                        <ImageUpload onUpload={field.onChange} value={field.value} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField control={form.control} name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <RequiredLabelIcon />
                                <FormControl>
                                    <Textarea className="min-h-20 resize-none border-gray-300 rounded-md" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <hr className="my-4" />
                    <div className="self-end">
                        <Button variant="bordered" radius="sm" disabled={form.formState.isSubmitting} type="submit">Add Product</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
