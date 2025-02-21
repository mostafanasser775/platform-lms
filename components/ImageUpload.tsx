/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { X } from "lucide-react";

export default function ImageUpload({ onUpload, value }: { onUpload: (url: string) => void, value?: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
                setFile(selectedFile);
                setPreview(URL.createObjectURL(selectedFile));
            }
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile) {
                setFile(droppedFile);
                setPreview(URL.createObjectURL(droppedFile));
            }
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setPreview(null);
        onUpload('')
        fileInputRef.current!.value = ""; // Reset file input
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select an image");

        setLoading(true);
        setProgress(10); // Start progress indicator

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/uploadImage", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (res.ok) {
                setProgress(100);
                onUpload(data.url);
                setTimeout(() => { setProgress(0); }, 1000); // Reset progress after success
            } else {
                alert("Upload failed");
                setProgress(0);
            }
        } catch (error) {
            console.error("Upload error:", error);
            setProgress(0);
        }

        setLoading(false);
    };
    useEffect(() => {
        if (value)setPreview(value)
    }, [])
    return (
        <div className="flex flex-col items-center space-y-4 p-6 border border-gray-300 rounded-lg bg-white w-full max-w-md">
            {/* Drag & Drop + Clickable Area */}
            <div
                className="relative w-full h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg
                 bg-gray-100 cursor-pointer hover:bg-gray-200 transition text-center"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()} // Click opens file picker
            >
                {preview ? (
                    <div className="relative w-full h-full">
                        <Button isIconOnly={true} variant="solid" color="danger"
                            onPress={() => { handleRemoveImage(); }}
                            className="absolute top-2 right-2 z-50 text-white "
                        >
                            <X size={24} />
                        </Button>

                        <Card radius="sm" className="w-full h-full flex items-center justify-center">
                            <CardBody className="p-0">
                                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                            </CardBody>
                        </Card>
                    </div>
                ) : (
                    <p className="text-gray-600">
                        <span className="font-medium">Click to choose</span> or drag & drop an image here
                    </p>
                )}
            </div>

            {/* Hidden File Input */}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

            {/* Upload Button & Progress */}
            <div className="w-full">
                <Button onPress={handleUpload} color="primary" variant="solid" disabled={!file || loading} className="w-full">
                    {loading ? <Spinner size="sm" color="white" /> : "Upload"}
                </Button>
                {progress > 0 && <Progress value={progress} className="mt-2" />}
            </div>
        </div>
    );
}
