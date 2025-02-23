'use client'
import { formatPlural } from "@/lib/formatters";
import { EyeIcon, LockIcon } from "lucide-react";
import { ActionButton } from "@/components/ActionButton";
import { ProdcutStatus } from "@/drizzle/schema";
import Image from "next/image";
import { deleteProductAction } from "../actions/product";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { TransationLinkBtn } from "@/components/TransationLinkBtn";
import { Chip } from "@heroui/chip";
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
        <div>
            <Table aria-label="Example static collection table" removeWrapper selectionMode="single">
                <TableHeader>
                    <TableColumn>
                        {formatPlural(products.length, {
                            singular: "product",
                            plural: "products",
                        })}
                    </TableColumn>
                    <TableColumn>Customers</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Actions</TableColumn>
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
                                <Chip >
                                    <div className="flex gap-x-2 items-center">
                                        <div>{getStatusIcon(product.status)}</div>
                                        <div> {product.status}</div>
                                    </div>

                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <TransationLinkBtn title="Edit" link={`/admin/products/${product.id}/edit`} variant={"flat"} color={"default"} />
                                    <ActionButton title="Delete" action={deleteProductAction.bind(null, product.id)} />
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
