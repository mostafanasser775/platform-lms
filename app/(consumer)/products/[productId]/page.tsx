import { SkeltonButton } from "@/components/SkeltonButton";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VideoIcon } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";

interface ProductPageProps {
    params: Promise<{ productId: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { productId } = await params;
    const Product = await getPublicProduct(productId);

    if (Product === undefined) return notFound();
    const courseCount = Product.courses.length;
    const lessonCount = sumArray(Product.courses, course =>
        sumArray(course.courseSections, s => s.lessons.length)
    );

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Product Info and Courses Section */}
                <div className="col-span-2 space-y-8 w-full">
                    {Product.courses.map(course => (
                        <Card key={course.id} className="border border-gray-300 rounded-xl shadow-lg p-6">
                            <CardHeader className="mb-4">
                                <div className="flex flex-col gap-2">
                                    <h2 className="text-xl font-semibold text-gray-800">{course.name}</h2>
                                    <div className="text-gray-500 text-sm block">
                                        {formatPlural(course.courseSections.length, {
                                            singular: "section", plural: "sections",
                                        }) + " . " +
                                            formatPlural(sumArray(course.courseSections, s => s.lessons.length), {
                                                singular: "lesson", plural: "lessons",
                                            })}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardBody className="space-y-4">
                                <Accordion type="multiple">
                                    {course.courseSections.map(section => (
                                        <AccordionItem key={section.id} value={section.id}>
                                            <AccordionTrigger className="flex justify-between items-center py-2 text-base font-medium text-gray-700 hover:text-gray-900">
                                                <div className="flex flex-col gap-1">
                                                    <span>{section.name}</span>
                                                    <span className="text-sm text-gray-500">
                                                        {formatPlural(section.lessons.length, {
                                                            singular: "lesson",
                                                            plural: "lessons",
                                                        })}
                                                    </span>
                                                </div>
                                                <span className="text-accent">▼</span>
                                            </AccordionTrigger>
                                            <AccordionContent className="pl-4">
                                                {section.lessons.map(lesson => (
                                                    <div key={lesson.id} className="flex items-center text-base gap-2 text-gray-700 py-2">
                                                        <VideoIcon className="text-accent" />
                                                        {lesson.status === "preview" ?
                                                            <Link href={`/courses/${course.id}/lessons/${lesson.id}`} className="text-accent hover:underline">{lesson.name}</Link>
                                                            :
                                                            <span>{lesson.name}</span>
                                                        }
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </CardBody>
                        </Card>
                    ))}
                </div>

                {/* Product Image and Purchase Section */}
                <div className="flex flex-col justify-between max-w-md">
                    <Card className="shadow-lg rounded-xl border border-gray-300">
                        <CardHeader className="relative aspect-video">
                            <Image src={Product.imageUrl} alt={Product.name} fill className="object-cover rounded-xl" />
                        </CardHeader>
                        <CardBody className="p-6 space-y-6">
                            <div className="flex flex-col items-start space-y-4">
                                <div className="text-xl text-gray-800 font-semibold">{formatPrice(Product.priceInDollars)}</div>
                                <h1 className="text-3xl font-bold text-gray-900">{Product.name}</h1>

                                <Suspense fallback={<SkeltonButton className="h-12 w-36" />} >
                                    <PurchesButton productId={Product.id} />
                                </Suspense>
                                <p className="text-base text-gray-700">Description : {Product.description}</p>

                                <div className="flex font-semibold  gap-2 text-gray-700 text-small">
                                    Content :
                                    <span className="text-gray-500 font-normal">{formatPlural(courseCount, {
                                        singular: "course",
                                        plural: "courses",
                                    })} . {formatPlural(lessonCount, {
                                        singular: "lesson",
                                        plural: "lessons",
                                    })}</span>
                                </div>


                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}

async function PurchesButton({ productId }: { productId: string }) {
    const { userId } = await getCurrentUser();
    const alreadyOwnProduct = userId !== undefined ? await userOwnsProductDB({ userId, productId }) : false;
    if (alreadyOwnProduct)
        return (
            <Button as={Link} href="/courses" variant="solid" color="success">
                You own this Course
            </Button>
        )
    return (
        <Button as={Link} href={`/products/${productId}/purchase`} color="primary">
            Get Now
        </Button>
    );
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
    });

    if (product == null) return product;

    const { courseProducts, ...other } = product;

    return {
        ...other,
        courses: courseProducts.map(cp => ({
            id: cp.course.id,
            name: cp.course.name,
            courseSections: cp.course.courseSections.map(section => ({
                id: section.id,
                name: section.name,
                lessons: section.lessons.map(lesson => ({
                    id: lesson.id,
                    name: lesson.name,
                    status: lesson.status,
                })),
            })),
        })),
    };
}
