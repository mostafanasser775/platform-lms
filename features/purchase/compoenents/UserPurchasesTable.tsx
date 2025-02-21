import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/formatters"
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Purchases && Purchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                            <TableCell>
                                <div className="flex items-center gap-4 ">
                                    <Image src={purchase.productDetails.imageUrl} className="size-12 object-cover rounded-lg "
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
                                <Badge variant="destructive">Refunded</Badge>
                                :
                                <Badge variant="default">${(purchase.pricePaidInCents / 100).toFixed(2)}</Badge>
                            }
                            </TableCell>
                            <TableCell>
                                <Button asChild variant="outline">
                                    <Link href={`/purchases/${purchase.id}`}>Details</Link>
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
                    <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
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