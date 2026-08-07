import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FadeIn } from "../ui/motion";
import { useAuth } from "../../context/AuthContext";
import api from "../../lib/api";

export default function DeleteAccountSection({ hasPassword }: { hasPassword: boolean }) {
  const [revealed, setRevealed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleDelete() {
    if (hasPassword && !password) {
      setError("Enter your password to confirm.");
      return;
    }
    setDeleting(true);
    setError("");
    try {
      await api.delete("/profile", { data: hasPassword ? { password } : {} });
      // The account and its refresh-token cookie are already gone
      // server-side — clear local auth state and leave.
      await logout().catch(() => {});
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Couldn't delete your account. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <FadeIn>
      <div className="bg-card rounded-2xl shadow-sm p-5 border border-red-100 dark:border-red-500/20">
        <h3 className="font-semibold text-red-700">Delete Account</h3>
        <p className="text-sm text-fg-muted mt-1">
          This permanently deletes your account and every session, interview, and resume report
          you've stored — including all English/Communication Coach, Interview Practice, and Resume
          Analyzer history. This can't be undone.
        </p>

        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="mt-4 text-sm font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors rounded-md px-4 py-2"
          >
            Delete my account
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {hasPassword ? (
              <>
                <label htmlFor="delete-account-password" className="block text-sm font-medium text-fg-secondary">
                  Enter your password to confirm
                </label>
                <input
                  id="delete-account-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-red-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </>
            ) : (
              <p className="text-sm text-fg-secondary">
                This account signs in with Google. Click below to confirm permanent deletion.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 transition-colors rounded-md px-4 py-2"
              >
                {deleting ? "Deleting…" : "Permanently delete my account"}
              </button>
              <button
                onClick={() => {
                  setRevealed(false);
                  setPassword("");
                  setError("");
                }}
                disabled={deleting}
                className="text-sm font-medium text-fg-secondary hover:text-fg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </FadeIn>
  );
}
