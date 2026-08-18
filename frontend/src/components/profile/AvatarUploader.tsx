import { useRef, useState } from "react";
import { motion } from "framer-motion";

const MAX_SIZE_BYTES = 3 * 1024 * 1024;

export default function AvatarUploader({
  avatarUrl,
  name,
  onUpload,
}: {
  avatarUrl: string;
  name: string;
  onUpload: (dataUrl: string) => Promise<void>;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("Image must be under 3MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setUploading(true);
      try {
        await onUpload(reader.result as string);
      } catch (err: any) {
        setError(err.response?.data?.message || "Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => setError("Couldn't read that file.");
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-4">
      <motion.div
        className="relative w-16 h-16 shrink-0"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`}
          alt="avatar"
          className="w-16 h-16 rounded-full object-cover border border-border"
        />
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-card/70 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </motion.div>
      <div>
        <label className="text-sm text-primary font-medium cursor-pointer hover:text-primary-hover">
          {avatarUrl ? "Change photo" : "Upload photo"}
          <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
        <p className="text-xs text-fg-muted mt-0.5">JPG or PNG, under 3MB</p>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    </div>
  );
}
