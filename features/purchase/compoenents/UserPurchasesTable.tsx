
'use client'
import { formatDate } from "@/lib/formatters"
import { Badge } from "@heroui/badge"
import { Button } from "@heroui/button"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table"
import Image from "next/image"
import Link from "next/link"

export default function UserPurchasesTable(
    { Purchases }: {
        Purchases: {
            id: string,
            pricePaidInCents: number,
            productDetails: { name: string, imageUrl: string },
            refundedAt: Date | null,
            createdAt: Date
        }[]
    }
) {
    return (
        <div>
            <Table  aria-label="Example static collection table"  selectionMode="single" >
                <TableHeader>
                    <TableColumn>Product</TableColumn>
                    <TableColumn>Amount</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                    {Purchases && Purchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                            <TableCell>
                                <div className="flex items-center gap-4 ">
                                    <Image src={purchase.productDetails.imageUrl} className="size-16 object-cover rounded-lg "
                                        alt={purchase.productDetails.name} width={192} height={192} />
                                    <div className="flex flex-col gap-1">
                                        <div className="font-semibold">
                                            {purchase.productDetails.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {formatDate(purchase.createdAt)}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{purchase.refundedAt ?
                                <Badge >Refunded</Badge>
                                :
                                <Badge >${(purchase.pricePaidInCents / 100).toFixed(2)}</Badge>
                            }
                            </TableCell>
                            <TableCell>
                                <Button as={Link} href={`/purchases/${purchase.id}`} variant="bordered">
                                    Details
                                </Button>
                            </TableCell>
                        </TableRow>

                    ))}
                </TableBody>

            </Table>
        </div>
    )

}
export function UserPurchasesTableSkeleton() {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableColumn>Product</TableColumn>
                    <TableColumn>Amount</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-muted" />
                                <div className="space-y-2">
                                    <div className="h-4 w-[250px] rounded-full bg-muted" />
                                    <div className="h-4 w-[200px] rounded-full bg-muted" />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="h-4 w-[200px] rounded-full bg-muted" />
                        </TableCell>
                        <TableCell>
                            <div className="h-4 w-[200px] rounded-full bg-muted" />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}