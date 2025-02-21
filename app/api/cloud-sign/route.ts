import {  NextResponse } from "next/server";
import crypto from "crypto";

export async function POST() {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const apiSecret = process.env.CLOUDINARY_API_SECRET!; // Private API key

    const signature = crypto
        .createHash("sha256")
        .update(`timestamp=${timestamp}${apiSecret}`)
        .digest("hex");

    return NextResponse.json({ timestamp, signature });
}
