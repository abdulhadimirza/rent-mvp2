'use client';

import { useState, useRef } from 'react';
import { UploadCloud, FileText, Cpu, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { processBillFile } from './actions';

export function UploadArea() {
    const [uploadingCount, setUploadingCount] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    const handleUploadFiles = async (selectedFiles: File[]) => {
        const validFiles = selectedFiles.filter((file) => {
            if (file.size > MAX_FILE_SIZE) {
                alert(`File "${file.name}" exceeds the 5 MB limit.`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setUploadingCount(validFiles.length);

        const uploadPromises = validFiles.map(async (file) => {
            try {
                const uniqueFilename = `${crypto.randomUUID()}-${file.name}`;

                const blob = await upload(uniqueFilename, file, {
                    access: 'public',
                    handleUploadUrl: '/api/v1/bill/upload',
                });

                const result = await processBillFile(blob.url);

                if (result.success) {
                    console.log(`Uploaded successfully ${result.message}`);
                } else {
                    alert(`Error processing ${file.name}: ${result.error}`);
                }
            } catch (error: unknown) {
                const errorMessage =
                    error instanceof Error ? error.message : 'An unknown error occurred';
                alert(`Upload failed for ${file.name}: ${errorMessage}`);
            } finally {
                setUploadingCount((prev) => Math.max(0, prev - 1));
            }
        });

        await Promise.all(uploadPromises);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files);
            e.target.value = '';
            await handleUploadFiles(selectedFiles);
        }
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const selectedFiles = Array.from(e.dataTransfer.files);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            await handleUploadFiles(selectedFiles);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Guidelines Card */}
            <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-8 flex flex-col justify-between shadow-sm">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        How Bill Upload Works
                    </h3>

                    <ul className="space-y-5">
                        <li className="flex gap-3">
                            <Cpu className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-slate-700">Zero Manual Data Entry</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Our AI automatically reads the PDF to extract the provider name, customer account number, total amount due, and due date.
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-slate-700">Automatic Updates & Deduplication</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Uploading a revised bill for the same provider, account number, and month updates the existing record and replaces the old PDF.
                                </p>
                            </div>
                        </li>
                        <li className="flex gap-3">
                            <UploadCloud className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-slate-700">Bulk Uploads Supported</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Select or drop multiple bill PDFs at once. The system queues and processes them in parallel, updating your dashboard in seconds.
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/60">
                    <div className="flex gap-2.5 items-center text-xs text-slate-500">
                        <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Supports PDF files up to 5 MB. Invalid or corrupted documents will be rejected.</span>
                    </div>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                className="border-2 border-dashed border-slate-300 rounded-2xl bg-white p-8 flex flex-col items-center justify-center text-center transition-all duration-200 hover:border-blue-500 hover:bg-slate-50/50 hover:shadow-sm cursor-pointer min-h-[320px]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="application/pdf"
                    multiple
                    onChange={handleFileChange}
                />

                {uploadingCount > 0 ? (
                    <div className="animate-pulse flex flex-col items-center">
                        <UploadCloud className="h-12 w-12 text-blue-500 mb-4 animate-bounce" />
                        <p className="text-slate-700 font-semibold">
                            Uploading & parsing {uploadingCount} PDF{uploadingCount > 1 ? 's' : ''}...
                        </p>
                        <p className="text-xs text-slate-400 mt-1">Please do not close this window</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="p-4 bg-blue-50 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                            <UploadCloud className="h-10 w-10 text-blue-500" />
                        </div>
                        <p className="text-slate-700 font-semibold text-base">
                            Click or drag PDF files here to upload
                        </p>
                        <p className="text-xs text-slate-400 mt-2 max-w-[240px]">
                            Automatically extracts important details like due date and amount.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
