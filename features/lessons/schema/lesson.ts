import { lessonStatuses } from "@/drizzle/schema";
import { z } from "zod";

export const lessonSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    sectionId: z.string().min(1, { message: "Required" }),
    status: z.enum(lessonStatuses),
    youtubeVideoId: z.string().min(1, { message: "Required" }),
    description: z.string().transform(value => (value === "" ? null : value)).nullable()

})