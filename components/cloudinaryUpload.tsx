"use client";
import { useState } from "react";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function VideoUpload({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleUpload = async (file: File) => {
        if (!file) return;
        setUploading(true);
        setProgress(0);
        setFileName(file.name);
        setError(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
        );

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
                        setProgress(percentCompleted);
                    },
                }
            );
            onUploadSuccess(response.data.secure_url)
            setVideoUrl(response.data.secure_url);
        } catch (error) {
            setError("Error uploading video. Please try again.");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (event.dataTransfer.files.length > 0) {
            if (event.dataTransfer.files[0])
                handleUpload(event.dataTransfer.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg border border-gray-300  w-full mx-auto">
            {/* Drag & Drop Area */}
            <div
                className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition duration-300 ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {!videoUrl ? (
                    <UploadCloud size={50} className="text-gray-500 transition duration-300 hover:text-blue-500" />
                ) : (
                    <CheckCircle size={50} className="text-green-500" />
                )}
                <p className="text-gray-700 mt-3 text-sm font-medium">
                    {videoUrl ? "Upload Successful!" : "Click or Drag to Upload Video"}
                </p>
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files && e.target.files[0] && handleUpload(e.target.files[0])}
                className="hidden"
                id="fileInput"
                disabled={uploading}
            />
            <label
                htmlFor="fileInput"
                className="mt-4 w-full py-2 px-4 text-center bg-blue-600 text-white rounded-lg cursor-pointer transition hover:bg-blue-700"
            >
                {uploading ? "Uploading..." : "Select Video"}
            </label>

            {/* Progress Bar */}
            {uploading && (
                <div className="w-full mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <FileText size={20} className="text-gray-600" />
                            <span className="text-gray-800 text-sm font-medium truncate w-40 overflow-hidden text-ellipsis">
                                {fileName}
                            </span>
                        </div>
                        <span className="text-gray-700 text-sm font-semibold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full bg-gray-200 rounded-full">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${progress < 50 ? "bg-red-500" : progress < 80 ? "bg-yellow-500" : "bg-green-500"
                                }`}
                            style={{ width: `${progress}%` }}
                        />
                    </Progress>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-4 flex items-center space-x-2 text-red-600">
                    <AlertCircle size={22} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            {/* Video Preview */}
            {/* {videoUrl && (
                <video width="100%" className="mt-4 rounded-lg shadow-md" controls>
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )} */}
        </div>
    );
}
