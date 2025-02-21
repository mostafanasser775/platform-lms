import { PageHeader } from "@/components/PageHeader";
import { SkeletonArray, SkeletonButton, SkeletonText } from "@/components/Skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { CourseSectionTable, CourseTable, LessonTable, UserCourseAccessTable, UserLessonCompleteTable } from "@/drizzle/schema";
import { formatPlural } from "@/lib/formatters";
import { getCurrentUser } from "@/services/clerk";
import { countDistinct, eq, and, asc } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";

export default function UserCousesPage() {
  return (
    <div className="container my-4">
      <PageHeader title={'Courses'} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Suspense fallback={
          <SkeletonArray amount={6}>
            <SkeletonCourseCard />
          </SkeletonArray>
        }>
          <CourseGrid />
        </Suspense>

      </div>

    </div>
  );
}
async function CourseGrid() {
  const { userId, redirectToSignIn } = await getCurrentUser()
  if (userId == null) return redirectToSignIn()

  const courses = await getUserCourses(userId)

  if (courses.length === 0) {
    return (
      <div className="flex flex-col gap-2 items-start">
        You have no courses yet
        <Button asChild size="lg">
          <Link href="/">Browse Courses</Link>
        </Button>
      </div>
    )
  }

  return courses.map(course => (
    <Card key={course.id} className="overflow-hidden flex flex-col">
      <CardHeader>
        <CardTitle>{course.name}</CardTitle>
        <CardDescription>
          {formatPlural(course.sectionCount, {
            plural: "sections",
            singular: "section",
          })}{" "}
          •{" "}
          {formatPlural(course.lessonCount, {
            plural: "lessons",
            singular: "lesson",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="line-clamp-3" title={course.description}>
        {course.description}
      </CardContent>
      <div className="flex-grow" />
      <CardFooter>
        <Button asChild>
          <Link href={`/courses/${course.id}`}>View Course</Link>
        </Button>
      </CardFooter>
      <div
        className="bg-accent h-2 -mt-2"
        style={{
          width: `${(course.lessonsCompletedCount / course.lessonCount) * 100}%`,
        }}
      />
    </Card>
  ))
}

function SkeletonCourseCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <SkeletonText className="w-3/4" />
        </CardTitle>
        <CardDescription>
          <SkeletonText className="w-1/2" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SkeletonText rows={3} />
      </CardContent>
      <CardFooter>
        <SkeletonButton />
      </CardFooter>
    </Card>
  )
}


async function getUserCourses(userId: string) {

  const courses = await db.select(
    {
      id: CourseTable.id,
      name: CourseTable.name,
      description: CourseTable.description,
      sectionCount: countDistinct(CourseSectionTable.id),
      lessonCount: countDistinct(LessonTable.id),
      lessonsCompletedCount: countDistinct(UserLessonCompleteTable.lessonId),

    }
  ).from(CourseTable)
    .leftJoin(UserCourseAccessTable, and(eq(UserCourseAccessTable.courseId, CourseTable.id), eq(UserCourseAccessTable.userId, userId)))
    .leftJoin(CourseSectionTable, and(eq(CourseSectionTable.courseId, CourseTable.id), eq(CourseSectionTable.status, 'public')))
    .leftJoin(LessonTable, and(eq(LessonTable.sectionId, CourseSectionTable.id), eq(LessonTable.status, 'public')))
    .leftJoin(UserLessonCompleteTable, and(eq(UserLessonCompleteTable.userId, userId), eq(UserLessonCompleteTable.lessonId, LessonTable.id)))
    .groupBy(CourseTable.id)
    .orderBy(asc(CourseTable.name))
  return courses
}