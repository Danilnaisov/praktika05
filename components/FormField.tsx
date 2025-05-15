"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormFieldProps = {
  id: string;
  label: string;
  type: "text" | "date" | "tel" | "select";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
  readOnly?: boolean;
};

export default function FormField({
  id,
  label,
  type,
  value,
  onChange,
  error,
  placeholder,
  options,
  readOnly,
}: FormFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="text-[#0060AC]">
        {label}
      </Label>
      {type === "select" ? (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger
            id={id}
            className={`border-[#0060AC] ${error ? "border-[#E41613]" : ""}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readOnly}
          className={`border-[#0060AC] focus:ring-[#0060AC] ${
            error ? "border-[#E41613]" : ""
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="text-[#E41613] text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
