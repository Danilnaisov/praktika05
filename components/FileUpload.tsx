/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { X, Upload, Edit2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface FileUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  accept?: string;
  folder?: string;
  readOnly?: boolean;
  entityId: string;
  entityType: string;
}

export function FileUpload({
  value,
  onChange,
  accept = "application/pdf",
  folder = "student-files",
  readOnly = false,
  entityId,
  entityType,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const uploadPromises = acceptedFiles.map(async (file) => {
          if (file.type !== "application/pdf") {
            throw new Error("Разрешена загрузка только PDF файлов");
          }

          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);
          formData.append("entityId", entityId);
          formData.append("entityType", entityType);

          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Ошибка при загрузке файла");
          }

          const data = await response.json();
          return `${data.url}|${data.fileId}`;
        });

        const results = await Promise.all(uploadPromises);
        onChange(results);
      } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
        toast.error(
          error instanceof Error ? error.message : "Ошибка при загрузке файла"
        );
      }
    },
    [folder, entityId, entityType, onChange, token]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
    disabled: readOnly,
  });

  const handleRemove = (index: number) => {
    if (readOnly) return;
    const updatedUrls = value.filter((_, i) => i !== index);
    onChange(updatedUrls);
  };

  const handleEdit = (index: number) => {
    if (readOnly) return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept || "";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          setIsUploading(true);
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);
          formData.append("entityId", entityId);
          formData.append("entityType", entityType);

          const response = await fetch("/api/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Ошибка при загрузке файла");
          }

          const data = await response.json();
          const updatedUrls = [...value];
          updatedUrls[index] = `${data.url}|${data.fileId}`; // Формат: url|fileId
          onChange(updatedUrls);
        } catch (error: any) {
          console.error("Ошибка при загрузке файла:", error.message);
          alert(`Ошибка: ${error.message}`);
        } finally {
          setIsUploading(false);
        }
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
            ${
              isDragActive
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-300 hover:border-blue-500 hover:bg-gray-50"
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center">
            <Upload
              className={`w-10 h-10 mb-2 ${
                isDragActive ? "text-blue-500" : "text-gray-500"
              }`}
            />
            <p className="text-sm text-gray-500">
              {isDragActive
                ? "Отпустите файлы здесь"
                : "Перетащите файлы сюда или нажмите для выбора"}
            </p>
          </div>
        </div>
      )}

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((urlWithId, index) => {
            const url = urlWithId.split("|")[0]; // Извлекаем URL для отображения
            return (
              <div
                key={index}
                className="relative group bg-gray-100 p-4 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-800 truncate">
                    {url.split("/").pop()}
                  </p>
                  {!readOnly && (
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(index)}
                        className="h-8 w-8 text-gray-600 hover:text-blue-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemove(index)}
                        className="h-8 w-8 text-gray-600 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isUploading && !readOnly && (
        <div className="text-sm text-gray-500">Загрузка файлов...</div>
      )}
    </div>
  );
}
