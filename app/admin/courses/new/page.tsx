import { PageHeader } from "@/components/PageHeader";
import { CourseForm } from "@/features/courses/components/CourseForm";

export default function NewCoursePage() {
    return <div className="container ">
        <PageHeader title="Add Course"/>
        <CourseForm />

    </div>
}