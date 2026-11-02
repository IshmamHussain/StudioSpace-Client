"use client";

import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, CheckCircle, Loader2, Link2, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

const SAMPLE_PRESETS = [
  {
    label: "Daylight Cyc",
    url: "https://images.unsplash.com/photo-1736580602204-b940bb0423ec?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Cinema Stage",
    url: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Podcast Lounge",
    url: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Music Suite",
    url: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Ceramics Loft",
    url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
  },
];

// ImgBB public upload key for demo/evaluation
const IMGBB_API_KEY = "6d207e02198a847aa5fb3d0add183b56";

export function ImageUploader({
  value,
  onChange,
  label = "Primary Studio Image",
  required = true,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image file size should be less than 10MB.");
      return;
    }

    try {
      setIsUploading(true);
      toast.info("Uploading image to ImgBB cloud storage...");

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success && result.data?.url) {
        onChange(result.data.url);
        toast.success("Image uploaded to ImgBB successfully!");
      } else {
        // Fallback: Read as base64 data URL if ImgBB API rate limit is reached
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            onChange(reader.result);
            toast.success("Image loaded successfully!");
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      // Fallback: Read as base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
          toast.success("Image loaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-studio-700 dark:text-studio-300">
          {label} {required && "*"}
        </label>
        <span className="text-[11px] text-amber-500 font-medium">
          ImgBB / PostImage / Direct URL
        </span>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all duration-200 text-center flex flex-col items-center justify-center gap-2 ${
          dragActive
            ? "border-amber-500 bg-amber-500/10"
            : "border-studio-300 dark:border-studio-800 bg-studio-50/50 dark:bg-studio-950 hover:border-amber-500/50 hover:bg-studio-100/50 dark:hover:bg-studio-900/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileUpload(e.target.files[0]);
            }
          }}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-xs font-semibold text-studio-600 dark:text-studio-300">
              Uploading to ImgBB...
            </p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                Click to upload or drag & drop image
              </p>
              <p className="text-[11px] text-studio-400 mt-0.5">
                Integrated ImgBB cloud storage (PNG, JPG, WEBP up to 10MB)
              </p>
            </div>
          </>
        )}
      </div>

      {/* Manual URL Input */}
      <div className="space-y-1.5">
        <div className="relative">
          <Link2 className="w-4 h-4 text-studio-400 absolute left-3.5 top-3" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste an ImgBB / PostImage / Unsplash URL..."
            className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-studio-200 dark:border-studio-800 bg-studio-50 dark:bg-studio-950 text-foreground placeholder:text-studio-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            required={required}
          />
        </div>
      </div>

      {/* Quick Sample Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[11px] text-studio-400 font-semibold mr-1">
          Quick Presets:
        </span>
        {SAMPLE_PRESETS.map((preset) => (
          <button
            type="button"
            key={preset.label}
            onClick={() => onChange(preset.url)}
            className="px-2.5 py-1 text-[11px] rounded-lg border border-studio-200 dark:border-studio-800 bg-studio-100 dark:bg-studio-800 text-studio-700 dark:text-studio-300 hover:border-amber-500/50 hover:text-amber-500 transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Live Preview */}
      {value && (
        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-studio-200 dark:border-studio-800 bg-studio-100 dark:bg-studio-950 shadow-sm">
          <img src={value} alt="Live preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
            title="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

