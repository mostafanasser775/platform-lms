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
import { Button } from "@heroui/button";
import ImageUpload from "@/components/ImageUpload";
import { Select, SelectedItems, SelectItem } from "@heroui/select";
import { Chip } from "@heroui/chip";
export function ProductForm({ product, courses }: {
    product?: { id: string,
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
                                    <Select isRequired variant="bordered" radius="sm" label="Status" labelPlacement="outside"
                                        placeholder="Select an status"
                                        onChange={(e) => field.onChange(e.target.value)}
                                        selectedKeys={[field.value]}
                                    >
                                        {productStatuses.map((status) =>
                                            <SelectItem key={status}>
                                                {status}
                                            </SelectItem>
                                        )}
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField control={form.control} name="courseIds"
                            render={({ field }) => (
                                <FormItem>
                                    <Select isRequired variant="bordered" radius="sm"
                                        label="Included Courses" labelPlacement="outside"
                                        placeholder="Select Courses"
                                        onChange={(e) => {
                                            new Set(e.target.value.split(",")).forEach((courseId) => {
                                                field.onChange([...field.value, courseId])
                                            })
                                        }


                                        }
                                        // onSelectionChange={field.onChange}
                                        selectedKeys={[...field.value]}
                                        selectionMode="multiple"
                                        renderValue={(items: SelectedItems<string[]>) => {
                                            return (
                                                <div className="flex flex-wrap gap-2">
                                                    {items.map((item) => (
                                                        <Chip key={item.key} radius="sm">
                                                            {item?.textValue}</Chip>
                                                    ))}
                                                </div>
                                            );
                                        }}>
                                        {courses.map((course) =>
                                            <SelectItem key={course.id} textValue={course.name}>
                                                {course.name}
                                            </SelectItem>
                                        )}
                                    </Select>
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
                        <Button variant="bordered" radius="sm" disabled={form.formState.isSubmitting} type="submit">{product == null ? "Create" : "Update"} Product</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
