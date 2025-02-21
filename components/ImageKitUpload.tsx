/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { IKUpload } from "imagekitio-next";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Progress } from "./ui/progress";
import { UploadCloud, CheckCircle, FileText, AlertCircle } from "lucide-react";

const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

const authenticator = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/auth");

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (error: unknown) {
        throw new Error(`Authentication request failed: ${error}`);
    }
};

export function ImageKitUpload({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
    const ikUploadRef = useRef<any>(null);
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleUploadClick = () => {
        if (!ikUploadRef.current) return;
        setIsUploading(true);
        setIsUploaded(false);
        setError(null);
        ikUploadRef.current.click();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        if (event.dataTransfer.files.length > 0) {
            const file = event.dataTransfer.files[0];
            if (file)
                setFileName(file.name);
            if (ikUploadRef.current) {
                ikUploadRef.current.files = event.dataTransfer.files;
                ikUploadRef.current.dispatchEvent(new Event("change", { bubbles: true }));
            }
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-medium border border-gray-300">
            <div
                className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition duration-300 ${isDragging ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
            >
                {!isUploaded ? (
                    <UploadCloud size={50} className="text-gray-500 transition duration-300 hover:text-blue-500" />
                ) : (
                    <CheckCircle size={50} className="text-green-500" />
                )}
                <p className="text-gray-700 mt-3 text-sm font-medium">
                    {isUploaded ? "Upload Successful!" : "Click or Drag to Upload Video"}
                </p>
            </div>
            <IKUpload
                onSuccess={(response) => {
                    const uploadedUrl = response.url; // ✅ Get the URL from ImageKit response
                    onUploadSuccess(uploadedUrl);
                }}
                style={{ display: "none" }}
                onChange={(file) => {
                    if (file) {
                        setFileName(file.target?.files?.[0]?.name || "");
                    }
                }}
                onUploadProgress={(progress) => {
                    const progressPercent = Math.round((progress.loaded / progress.total) * 100);
                    setProgress(progressPercent);
                    if (progressPercent === 100) {
                        setTimeout(() => {
                            setIsUploading(false);
                            setIsUploaded(true);
                        }, 500);
                    }
                }}
                onError={() => {
                    setError("Upload failed. Please try again.");
                    setIsUploading(false);
                }}
                publicKey={publicKey!}
                authenticator={authenticator}
                urlEndpoint="https://ik.imagekit.io/upnrniwfg"
                ref={ikUploadRef}
            />
            <Button
                className={`mt-5 w-full py-3 rounded-lg font-semibold transition duration-300 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                onClick={handleUploadClick}
                disabled={isUploading}
            >
                {isUploading ? "Uploading..." : "Upload Video"}
            </Button>
            {progress > 0 && (
                <div className="w-full mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                            <FileText size={20} className="text-gray-600" />
                            <span className="text-gray-800 text-sm font-medium truncate w-40 overflow-hidden text-ellipsis" title={fileName}>{fileName}</span>
                        </div>
                        <span className="text-gray-700 text-sm font-semibold">{progress}%</span>
                    </div>
                    <Progress value={progress} className={`w-full ${progress < 50 ? "bg-red-500" : progress < 80 ? "bg-yellow-500" : "bg-green-500"}`} />
                </div>
            )}
            {error && (
                <div className="mt-4 flex items-center space-x-2 text-red-600">
                    <AlertCircle size={22} />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}
        </div>
    );
}
