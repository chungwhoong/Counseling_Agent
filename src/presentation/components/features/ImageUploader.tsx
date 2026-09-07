"use client";

import { useState, useRef } from "react";
import { Camera, ImageIcon, X } from "lucide-react";
import { Button } from "../ui/Button";

interface ImageUploaderProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

export function ImageUploader({ onFileSelect, accept = "image/*" }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearImage = () => {
    setPreview(null);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-accent/50 rounded-2xl p-10 text-center bg-accent/5 hover:bg-accent/10 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="w-14 h-14 text-accent/60 mx-auto mb-4" />
          <p className="font-semibold text-slate-700 mb-1">사진을 업로드하세요</p>
          <p className="text-sm text-slate-500 mb-6">드래그앤드롭 또는 아래 버튼을 클릭하세요</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
              카메라로 찍기
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-4 h-4" />
              갤러리에서 선택
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-4">JPEG, PNG, WebP · 최대 10MB</p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-2xl p-4 bg-white">
          <div className="flex items-center gap-4">
            <img src={preview} alt="미리보기" className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-700 truncate">{fileName}</p>
              <button onClick={clearImage} className="text-sm text-slate-400 hover:text-red-500 flex items-center gap-1 mt-1">
                <X className="w-3.5 h-3.5" />
                다른 이미지 선택
              </button>
            </div>
          </div>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
      <input ref={cameraInputRef} type="file" accept={accept} capture="environment" onChange={handleChange} className="hidden" />
    </div>
  );
}
