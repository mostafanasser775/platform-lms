import { PageHeader } from "@/components/PageHeader";
import {
  SkeletonArray,
  SkeletonButton,
  SkeletonText,
} from "@/components/Skeleton";
import { db } from "@/drizzle/db";
import {
  CourseSectionTable,
  CourseTable,
  LessonTable,
  UserCourseAccessTable,
  UserLessonCompleteTable,
} from "@/drizzle/schema";
import { formatPlural } from "@/lib/formatters";
import { getCurrentUser } from "@/services/clerk";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { and, countDistinct, eq, or } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import { Progress } from "@heroui/progress";

export default function CoursesPage() {
  return (
    <div className="container my-8">
      <PageHeader title="My Courses" />
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <Suspense
          fallback={
            <SkeletonArray amount={6}>
              <SkeletonCourseCard />
            </SkeletonArray>}
        >
          <CourseGrid />
        </Suspense>
      </div>
    </div>
  );
}

async function CourseGrid() {
  const { userId, redirectToSignIn } = await getCurrentUser();
  if (userId == null) return redirectToSignIn();

  const courses = await getUserCourses(userId);

  if (courses.length === 0) {
    return (
      <div className="flex flex-col gap-3 items-start text-center mt-6">
        <p className="text-lg font-medium">You have no courses yet.</p>
        <Button as={Link} href="/products" size="lg" color="primary">Browse Courses</Button>
      </div>
    );
  }

  return courses.map((course) => (
    <Card key={course.id} className="shadow-md hover:shadow-lg transition-shadow border">
      <CardHeader className="p-5">
        <div className="flex flex-col gap-1">
          <span className="text-xl font-bold">{course.name}</span>
          <span className="text-gray-600">
            {formatPlural(course.sectionsCount, { plural: "sections", singular: "section" })} •
            {formatPlural(course.lessonsCount, { plural: "lessons", singular: "lesson" })}
          </span>
        </div>
      </CardHeader>
      <CardBody className="px-5 pb-3">
        <div className="line-clamp-5 text-gray-700">{course.description}</div>
      </CardBody>
      <div className="flex-grow" />
      <CardFooter className="flex justify-between items-center px-5 pb-5">
        <Button as={Link} href={`/courses/${course.id}`} size="lg">
          View Course
        </Button>
      </CardFooter>
      <Progress
        value={(course.lessonsComplete / course.lessonsCount) * 100}
        className="h-2 rounded-b-lg bg-gray-200"
      />
    </Card>
  ));
}

function SkeletonCourseCard() {
  return (
    <Card className="shadow-md">
      <CardHeader className="p-5">
        <SkeletonText className="w-3/4" />
        <SkeletonText className="w-1/2" />
      </CardHeader>
      <CardBody className="px-5 pb-3">
        <SkeletonText rows={5} />
      </CardBody>
      <CardFooter className="flex justify-between items-center px-5 pb-5">
        <SkeletonButton />
      </CardFooter>
    </Card>
  );
}

async function getUserCourses(userId: string) {
  const courses = await db
    .select({
      id: CourseTable.id,
      name: CourseTable.name,
      description: CourseTable.description,
      sectionsCount: countDistinct(CourseSectionTable.id),
      lessonsCount: countDistinct(LessonTable.id),
      lessonsComplete: countDistinct(UserLessonCompleteTable.lessonId),
    })
    .from(CourseTable)
    .innerJoin(
      UserCourseAccessTable,
      and(
        eq(UserCourseAccessTable.courseId, CourseTable.id),
        eq(UserCourseAccessTable.userId, userId)
      )
    )
    .leftJoin(
      CourseSectionTable,
      and(eq(CourseSectionTable.courseId, CourseTable.id), eq(CourseSectionTable.status, "public"))
    )
    .leftJoin(
      LessonTable,
      and(
        eq(LessonTable.sectionId, CourseSectionTable.id),
        or(eq(LessonTable.status, "preview"), eq(LessonTable.status, "public"))
      )
    )
    .leftJoin(
      UserLessonCompleteTable,
      and(
        eq(UserLessonCompleteTable.lessonId, LessonTable.id),
        eq(UserLessonCompleteTable.userId, userId)
      )
    )
    .orderBy(CourseTable.name)
    .groupBy(CourseTable.id);

  return courses;
}