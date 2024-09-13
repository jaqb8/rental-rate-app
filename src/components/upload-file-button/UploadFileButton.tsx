"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useRef } from "react";

export interface FileData {
  name: string;
  size: number;
  type: string;
}

export default function UploadFileButton({
  children,
  onFileSelect,
  accept,
}: {
  children: React.ReactNode;
  onFileSelect: (file: FileData | null) => void;
  accept: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    let fileData = null;
    if (file) {
      fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
      };
    }
    onFileSelect(fileData);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          onClick={handleButtonClick}
          variant="outline"
          size="sm"
        >
          <Upload className="mr-2 h-4 w-4" />
          {children}
        </Button>
        <Input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept={accept}
          ref={fileInputRef}
        />
      </div>
    </div>
  );
}
