
import { db } from "@/drizzle/db"
import { CourseSectionTable, CourseTable, LessonTable, ProductTable, PurchaseTable, UserCourseAccessTable } from "@/drizzle/schema"
import { formatNumber, formatPrice } from "@/lib/formatters"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { count, countDistinct, isNotNull, sql, sum } from "drizzle-orm"
import { ReactNode } from "react"

export default async function AdminPage() {
    const {
        averageNetPurchasesPerCustomer,
        netPurchases,
        netSales,
        refundedPurchases,
        totalRefunds,
    } = await getPurchaseDetails()

    return (
        <div className="container my-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 md:grid-cols-4 gap-4">
                <StatCard title="Net Sales">{formatPrice(netSales)}</StatCard>
                <StatCard title="Refunded Sales">{formatPrice(totalRefunds)}</StatCard>
                <StatCard title="Un-Refunded Purchases">
                    {formatNumber(netPurchases)}
                </StatCard>
                <StatCard title="Refunded Purchases">
                    {formatNumber(refundedPurchases)}
                </StatCard>
                <StatCard title="Purchases Per User">
                    {formatNumber(averageNetPurchasesPerCustomer, {
                        maximumFractionDigits: 2,
                    })}
                </StatCard>
                <StatCard title="Students">
                    {formatNumber(await getTotalStudents())}
                </StatCard>
                <StatCard title="Products">
                    {formatNumber(await getTotalProducts())}
                </StatCard>
                <StatCard title="Courses">
                    {formatNumber(await getTotalCourses())}
                </StatCard>
                <StatCard title="CourseSections">
                    {formatNumber(await getTotalCourseSections())}
                </StatCard>
                <StatCard title="Lessons">
                    {formatNumber(await getTotalLessons())}
                </StatCard>
            </div>
        </div>
    )
}

function StatCard({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Card>
            <CardHeader className="text-center">{title}</CardHeader>
            <CardBody className="font-bold text-2xl">
                {children}
            </CardBody>
        </Card>
    )
}

async function getPurchaseDetails() {


    const data = await db
        .select({
            totalSales: sql<number>`COALESCE(${sum(
                PurchaseTable.pricePaidInCents
            )}, 0)`.mapWith(Number),
            totalPurchases: count(PurchaseTable.id),
            totalUsers: countDistinct(PurchaseTable.userId),
            isRefund: isNotNull(PurchaseTable.refundedAt),
        })
        .from(PurchaseTable)
        .groupBy(table => table.isRefund)

    const [refundData] = data.filter(row => row.isRefund)
    const [salesData] = data.filter(row => !row.isRefund)

    const netSales = (salesData?.totalSales ?? 0) / 100
    const totalRefunds = (refundData?.totalSales ?? 0) / 100
    const netPurchases = salesData?.totalPurchases ?? 0
    const refundedPurchases = refundData?.totalPurchases ?? 0
    const averageNetPurchasesPerCustomer =
        salesData?.totalUsers != null && salesData.totalUsers > 0
            ? netPurchases / salesData.totalUsers
            : 0

    return {
        netSales,
        totalRefunds,
        netPurchases,
        refundedPurchases,
        averageNetPurchasesPerCustomer,
    }
}

async function getTotalStudents() {

    const [data] = await db
        .select({ totalStudents: countDistinct(UserCourseAccessTable.userId) })
        .from(UserCourseAccessTable)

    if (data == null) return 0
    return data.totalStudents
}

async function getTotalCourses() {

    const [data] = await db
        .select({ totalCourses: count(CourseTable.id) })
        .from(CourseTable)

    if (data == null) return 0
    return data.totalCourses
}

async function getTotalProducts() {

    const [data] = await db
        .select({ totalProducts: count(ProductTable.id) })
        .from(ProductTable)
    if (data == null) return 0
    return data.totalProducts
}

async function getTotalLessons() {

    const [data] = await db
        .select({ totalLessons: count(LessonTable.id) })
        .from(LessonTable)
    if (data == null) return 0
    return data.totalLessons
}

async function getTotalCourseSections() {

    const [data] = await db
        .select({ totalCourseSections: count(CourseSectionTable.id) })
        .from(CourseSectionTable)
    if (data == null) return 0
    return data.totalCourseSections
}
