'use client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatPlural } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EyeIcon, LockIcon, Trash2Icon } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { ProdcutStatus } from "@/drizzle/schema";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { deleteProductAction } from "../actions/product";
export function ProductTable({ products }: {
    products: {
        id: string,
        name: string,
        description: string,
        imageUrl: string,
        priceInDollars: number,
        status: ProdcutStatus,
        courseCount: number
        customersCount: number
    }[]
}) {
    return (
        <div className="container ">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            {formatPlural(products.length, {
                                singular: "product",
                                plural: "products",
                            })}
                        </TableHead>
                        <TableHead>Customers</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products && products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell className="flex items-center gap-4 ">
                                <Image className="object-cover rounded-md size-12"
                                    src={product.imageUrl}
                                    alt={product.name}
                                    width={192} height={192} />
                                <div className="flex flex-col gap-1">
                                    <div className="font-semibold">{product.name}</div>
                                    <div className="text-muted-foreground">
                                        {formatPlural(product.courseCount, { singular: 'course', plural: 'courses' })} {" "}
                                        ${(product.priceInDollars)}
                                    </div>

                                </div>
                            </TableCell>
                            <TableCell>{product.customersCount}</TableCell>
                            <TableCell>
                                <Badge className="py-2 gap-x-2 ">
                                    <div>{getStatusIcon(product.status)}</div>
                                    <div> {product.status}</div>
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <Button asChild ><Link href={`/admin/products/${product.id}/edit`}>Edit</Link></Button>
                                    <ActionButton variant={'destructive'} requireAreYouSure
                                        action={deleteProductAction.bind(null, product.id)}>
                                        <Trash2Icon />
                                        <span className="sr-only">Delete</span>
                                    </ActionButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                    }
                </TableBody>

            </Table>
        </div>
    )
}
export function getStatusIcon(status: ProdcutStatus) {
    const Icon = {
        public: EyeIcon,
        private: LockIcon
    }[status]

    return <Icon className="size-4" />
}
