"use-client";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";
import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  const [uploadName, setUploadName] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("");

  function truncateString(str: string) {
    return str.length > 40 ? str.substring(0, 40) + "..." : str;
  }

  const isPdf = mimeType === "application/pdf";
  const isImage = mimeType.startsWith("image/");

  if (value && isImage) {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Uploaded file"
          className="rounded-full object-cover"
        />
        <button
          type="button"
          onClick={() => {
            onChange("");
            setUploadName("");
            setMimeType("");
          }}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (value && isPdf) {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400 " />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
        >
          {truncateString(uploadName)}
        </a>
        <button
          onClick={() => {
            onChange("");
            setUploadName("");
            setMimeType("");
          }}
          className="bg-rose-500 text-white p-0 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        if (!res || res.length === 0) return;
        const uploaded = res[0];
        const mime = uploaded.type || "";
        const isPdf = mime === "application/pdf";
        let url = uploaded.url || uploaded.ufsUrl;
        if (isPdf && !url.endsWith(".pdf")) {
          url += ".pdf";
        }
        onChange(url);
        setUploadName(uploaded.name || "");
        setMimeType(mime);
      }}
      onUploadError={(error: Error) => {
        console.error("Upload failed:", error);
      }}
    />
  );
};
