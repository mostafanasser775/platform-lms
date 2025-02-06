import { db } from "@/drizzle/db";
import { UserCourseAccessTable } from "@/drizzle/schema";

export async function addUserCourseAccess({userId,courseids}:{userId:string,courseids:string[]},trx:Omit<typeof db,'$client'>=db){
const accesses= await trx.insert(UserCourseAccessTable).values(courseids.map(courseId=>({userId,courseId}))).onConflictDoNothing().returning();
return accesses
}