
import { db } from "@/drizzle/db";
import { DashboardClientLandingPage } from "./DashboardClientLandingPage";
import { CourseSectionTable, CourseTable, LessonTable, ProductTable, PurchaseTable, UserCourseAccessTable } from "@/drizzle/schema";
import { count, countDistinct, isNotNull, sql, sum, desc } from "drizzle-orm"
export default async function DashboardLandingPage() {
  const { averageNetPurchasesPerCustomer, netPurchases, netSales, refundedPurchases, totalRefunds } = await getPurchaseDetails()
  const totalCourses = await getTotalCourses()
  const totalStudents = await getTotalStudents()
  const totalProducts = await getTotalProducts()
  const totalCourseSections = await getTotalCourseSections()
  const totalLessons = await getTotalLessons()
  const topPurchases = await getTopPurchases()
  console.log(topPurchases)
  return <div>
    <DashboardClientLandingPage

      averageNetPurchasesPerCustomer={averageNetPurchasesPerCustomer}
      netPurchases={netPurchases}
      netSales={netSales}
      refundedPurchases={refundedPurchases}
      totalRefunds={totalRefunds}
      totalCourses={totalCourses}
      totalStudents={totalStudents}
      totalProducts={totalProducts}
      totalCourseSections={totalCourseSections}
      totalLessons={totalLessons}
      topPurchases={topPurchases}


    />
  </div>
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


async function getTopPurchases() {
  const purchases = await db.query.PurchaseTable.findMany({
    columns: { id: true, pricePaidInCents: true, refundedAt: true, createdAt: true },
    orderBy: desc(PurchaseTable.createdAt),
    with: {
      user: {
        columns: { name: true }
      }
    },
    limit: 10
  })
  return purchases
}