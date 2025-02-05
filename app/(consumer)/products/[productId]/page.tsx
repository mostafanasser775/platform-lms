import { SkeltonButton } from "@/components/SkeltonButton";
import { Button } from "@/components/ui/button";
import { db } from "@/drizzle/db";
import { CourseSectionTable, LessonTable, ProductTable } from "@/drizzle/schema";
import { userOwnsProductDB } from "@/features/products/db/product";
import { wherePublicProducts } from "@/features/products/permissions/products";
import { formatPlural, formatPrice } from "@/lib/formatters";
import { sumArray } from "@/lib/sumArray";
import { getCurrentUser } from "@/services/clerk";
import { and, asc, eq, or } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VideoIcon } from "lucide-react";
export default async function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
    const { productId } = await params;
    const Product = await getPublicProduct(productId)

    // const courses = await getCourses()
    if (Product === undefined) return notFound()
    const courseCount = Product.courses.length
    const lessonCount = sumArray(Product.courses, course =>
        sumArray(course.courseSections, s => s.lessons.length)
    )
    return <div className="container my-4">
        <div className="flex gap-16 items-center justify-between">
            <div className='flex gap-6 flex-col items-start'>
                <div className="flex flex-col gap-2">
                    <Suspense fallback={<div> ...loading</div>}>
                        <div className="text-xl">
                            {formatPrice(Product.priceInDollars)}
                        </div>
                    </Suspense>
                    <h1 className='text-4xl font-semibold'>{Product.name}</h1>
                    <div className=" text-muted-foreground">
                        {formatPlural(courseCount, {
                            singular: "course",
                            plural: "courses",
                        })}{" "} . {" "}

                        {lessonCount === undefined ? "No lessons Provided" : formatPlural(lessonCount, {
                            singular: "lesson",
                            plural: "lessons",
                        })}
                    </div>
                    <div className="text-xl">{Product.description}</div>

                    <Suspense fallback={<div><SkeltonButton className="h-12 w-36" /></div>}>
                        <PurchesButton productId={Product.id} />
                    </Suspense>
                </div>


            </div>
            <div className="relative aspect-video max-w-lg flex-grow">
                <Image src={Product.imageUrl} alt={Product.name} fill className="object-contain rounded-xl" />
            </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2  gap-8 mt-8 items-start">
            {Product.courses.map(course => (
                <Card key={course.id} className="flex flex-col gap-4 border p-4 rounded-lg">
                    <CardHeader>{course.name}</CardHeader>
                    <CardDescription>
                        <div className="text-muted-foreground px-4">
                            {
                                formatPlural(course.courseSections.length, {
                                    singular: "section",
                                    plural: "sections",
                                }) + " . " + formatPlural(sumArray(course.courseSections, s => s.lessons.length), {
                                    singular: "lesson",
                                    plural: "lessons",

                                })
                            }
                        </div>
                    </CardDescription>
                    <CardContent>
                        <Accordion type="multiple">
                            {course.courseSections.map(section => (
                                <AccordionItem key={section.id} value={section.id}>
                                    <AccordionTrigger className="flex gap-2 ">
                                        <div className="flex flex-col flex-grow">
                                            <span className="text-lg">{section.name}</span>
                                            <span className="text-muted-foreground">
                                                {formatPlural(section.lessons.length, {
                                                    singular: "lesson",
                                                    plural: "lessons",
                                                })}
                                            </span>

                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="flex flex-col gap-2">
                                        {section.lessons.map(lesson => (
                                            <div key={lesson.id} className="flex items-center text-base gap-2">
                                                <VideoIcon className="size-4" />
                                                {lesson.status === "preview" ?
                                                    <Link className="text-accent" href={`/courses/${course.id}/lessons/${lesson.id}`}>{lesson.name}</Link>
                                                    :
                                                     lesson.name 
                                                }
                                            </div>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}

                        </Accordion>

                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
}


async function PurchesButton({ productId }: { productId: string }) {
    const { userId } = await getCurrentUser();
    const alreadyOwnProduct = userId !== undefined ? await userOwnsProductDB({ userId, productId }) : false
    if (alreadyOwnProduct) return <div className="w-full h-12 bg-slate-600 animate-pulse rounded-lg">
        You already own this product
    </div>
    return (
        <Button className="text-xl h-auto py-4 px-8 rounded-lg" asChild>
            <Link href={`/products/${productId}/purchase`}>Get Now</Link>
        </Button>
    )
}
async function getPublicProduct(id: string) {

    const product = await db.query.ProductTable.findFirst({
        columns: {
            id: true,
            name: true,
            description: true,
            priceInDollars: true,
            imageUrl: true,
        },
        where: and(eq(ProductTable.id, id), wherePublicProducts),
        with: {
            courseProducts: {
                columns: {},
                with: {
                    course: {
                        columns: { id: true, name: true },
                        with: {
                            courseSections: {
                                columns: { id: true, name: true },
                                where: eq(CourseSectionTable.status, "public"),
                                orderBy: asc(CourseSectionTable.order),
                                with: {
                                    lessons: {
                                        columns: { id: true, name: true, status: true },
                                        where: or(eq(LessonTable.status, "public"), eq(LessonTable.status, "preview")),
                                        orderBy: asc(LessonTable.order),
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    })

    if (product == null) return product

    const { courseProducts, ...other } = product

    return {
        ...other,
        courses: courseProducts.map(cp => cp.course),
    }
}
