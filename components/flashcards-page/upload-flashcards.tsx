"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FileUploader } from "@/components/ui/file-uploader"
import { Upload } from "lucide-react"

export function FlashcardsUploader({ onUpload }: { onUpload: (files: File[]) => void }) {
    const [files, setFiles] = React.useState<File[]>([])

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Upload className="w-4 h-4" /> {files.length > 0 && `(${files.length})`}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Upload files</DialogTitle>
                    <DialogDescription>
                        Drag and drop your files here or click to browse.
                    </DialogDescription>
                </DialogHeader>
                <FileUploader
                    maxFileCount={1}
                    onValueChange={setFiles}
                    accept={{
                        "application/json": [".json"],
                        "text/csv": [".csv"],
                    }}
                />
                <Button className="mt-4" onClick={() => { onUpload(files) }} disabled={!files.length}>Upload</Button>
            </DialogContent>
        </Dialog>
    )
}