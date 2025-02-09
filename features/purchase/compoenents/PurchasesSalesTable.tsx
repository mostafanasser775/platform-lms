import { ActionButton } from "@/components/ActionButton"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDate, formatPlural } from "@/lib/formatters"
import Image from "next/image"
import { refundPurchase } from "../actions/purchase"

export default function PurchasesSalesTable(
    { Purchases }: {
        Purchases: {
            id: string,
            pricePaidInCents: number,
            productDetails: { name: string, imageUrl: string },
            refundedAt: Date | null, // Add the ? to indicate that refundedAt can be null
            createdAt: Date,
            user: { name: string }
        }[]
    }
) {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{formatPlural(Purchases.length, { singular: "sale", plural: "sales" })}</TableHead>
                        <TableHead>Customer Name</TableHead>
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
                            <TableCell>{purchase.user.name}</TableCell>
                            <TableCell>{purchase.refundedAt ?
                                <Badge variant="destructive">Refunded</Badge>
                                :
                                <Badge variant="default">${(purchase.pricePaidInCents / 100).toFixed(2)}</Badge>
                            }
                            </TableCell>
                            <TableCell>
                                {purchase.refundedAt === null && purchase.pricePaidInCents > 0}
                                <ActionButton action={refundPurchase.bind(null, purchase.id)} variant={"destructive"} requireAreYouSure>
                                    Refund 
                                </ActionButton>
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