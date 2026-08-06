import { useRef, useState } from "react";
import { motion } from "framer-motion";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // matches backend's multer limit

export default function UploadZone({
  file,
  onSelect,
  disabled,
}: {
  file: File | null;
  onSelect: (file: File | null) => void;
  disabled?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function validateAndSelect(candidate: File | undefined | null) {
    if (!candidate) return;
    setError("");
    if (candidate.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (candidate.size > MAX_SIZE_BYTES) {
      setError("File must be under 5MB.");
      return;
    }
    onSelect(candidate);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    validateAndSelect(e.dataTransfer.files?.[0]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  return (
    <div>
      <motion.div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={file ? `Resume selected: ${file.name}. Press Enter to choose a different file.` : "Upload resume PDF, drag and drop or press Enter to browse"}
        onKeyDown={handleKeyDown}
        onDragOver={(e: React.DragEvent) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        animate={{
          borderColor: dragging ? "#2f57cc" : "#CBD5E1",
          backgroundColor: dragging ? "#EEF4FF" : "#FFFFFF",
        }}
        transition={{ duration: 0.15 }}
        className={`border-2 border-dashed rounded-xl px-6 py-10 text-center focus:outline-none focus:ring-2 focus:ring-primary ${
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-10 h-10 mx-auto text-primary" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M7 3h7l4 4v14H7V3z M14 3v4h4 M9 12h6 M9 16h6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {file ? (
          <p className="mt-3 text-sm font-medium text-fg-secondary">{file.name}</p>
        ) : (
          <>
            <p className="mt-3 text-sm font-medium text-fg-secondary">
              Drag and drop your resume PDF, or click to browse
            </p>
            <p className="text-xs text-fg-muted mt-1">PDF only, up to 5MB</p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          disabled={disabled}
          onChange={(e) => validateAndSelect(e.target.files?.[0])}
          className="hidden"
        />
      </motion.div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
