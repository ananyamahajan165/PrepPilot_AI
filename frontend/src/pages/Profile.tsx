import { FormEvent, useEffect, useState } from "react";
import Layout from "../components/Layout";
import AvatarUploader from "../components/profile/AvatarUploader";
import SkillsInput from "../components/profile/SkillsInput";
import ProfileCompletionCard from "../components/profile/ProfileCompletionCard";
import DeleteAccountSection from "../components/profile/DeleteAccountSection";
import { FadeIn, staggerDelay } from "../components/ui/motion";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

interface FullProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  college: string;
  branch: string;
  skills: string[];
  github: string;
  linkedin: string;
  provider: "local" | "google";
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_ISH_REGEX = /^https?:\/\/.+\..+/;

function skeletonBlock(className: string) {
  return <div className={`animate-pulse rounded-md bg-surface-secondary ${className}`} />;
}

export default function Profile() {
  const { setUser } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<FullProfile | null>(null);
  const [completion, setCompletion] = useState({ percent: 0, missingFields: [] as string[] });
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    api
      .get("/profile")
      .then((res) => {
        const p: FullProfile = res.data.user;
        setProfile(p);
        setCompletion(res.data.profileCompletion);
        setName(p.name);
        setEmail(p.email);
        setBio(p.bio);
        setCollege(p.college);
        setBranch(p.branch);
        setSkills(p.skills);
        setGithub(p.github);
        setLinkedin(p.linkedin);
      })
      .finally(() => setLoading(false));
  }, []);

  function validateProfileForm() {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!EMAIL_REGEX.test(email)) errors.email = "Enter a valid email address.";
    if (bio.length > 300) errors.bio = "Bio must be 300 characters or fewer.";
    if (github && !URL_ISH_REGEX.test(github.startsWith("http") ? github : `https://${github}`)) {
      errors.github = "Enter a valid GitHub URL.";
    }
    if (linkedin && !URL_ISH_REGEX.test(linkedin.startsWith("http") ? linkedin : `https://${linkedin}`)) {
      errors.linkedin = "Enter a valid LinkedIn URL.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    if (!validateProfileForm()) return;

    setSavingProfile(true);
    try {
      const res = await api.put("/profile", { name, email, bio, college, branch, skills, github, linkedin });
      setProfile(res.data.user);
      setCompletion(res.data.profileCompletion);
      setUser({ id: res.data.user.id, name: res.data.user.name, email: res.data.user.email, avatarUrl: res.data.user.avatarUrl });
      setProfileMsg("Profile updated successfully.");
      showToast("Profile updated successfully.", "success");
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation don't match.");
      return;
    }

    setSavingPassword(true);
    try {
      await api.put("/profile/password", { currentPassword, newPassword });
      setPasswordMsg("Password updated successfully.");
      showToast("Password updated successfully.", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || "Could not update password.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleAvatarUpload(dataUrl: string) {
    if (!profile) return;
    const res = await api.put("/profile/avatar", { avatarDataUrl: dataUrl });
    setProfile((prev) => (prev ? { ...prev, avatarUrl: res.data.avatarUrl } : prev));
    setCompletion(res.data.profileCompletion);
    setUser({ id: profile.id, name: profile.name, email: profile.email, avatarUrl: res.data.avatarUrl });
  }

  if (loading || !profile) {
    return (
      <Layout>
        <div className="space-y-6">
          {skeletonBlock("h-8 w-40")}
          <div className="grid md:grid-cols-2 gap-6">
            {skeletonBlock("h-64 rounded-2xl")}
            {skeletonBlock("h-64 rounded-2xl")}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-fg mb-6">Profile</h1>

      <div className="space-y-6">
        <ProfileCompletionCard percent={completion.percent} missingFields={completion.missingFields} />

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <FadeIn delay={staggerDelay(0)}>
            <div className="bg-card rounded-2xl shadow-sm p-5">
              <AvatarUploader avatarUrl={profile.avatarUrl} name={profile.name} onUpload={handleAvatarUpload} />

              <form onSubmit={handleProfileSubmit} className="mt-5">
                <h3 className="font-semibold text-fg mb-3">Personal Details</h3>
                {profileMsg && <p role="status" className="text-sm text-green-600 mb-2">{profileMsg}</p>}
                {profileError && <p role="alert" className="text-sm text-red-600 mb-2">{profileError}</p>}

                <label htmlFor="profile-name" className="block text-sm font-medium text-fg-secondary mb-1">Name</label>
                <input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-field mb-1"
                />
                {fieldErrors.name && <p role="alert" className="text-xs text-red-600 mb-2">{fieldErrors.name}</p>}

                <label htmlFor="profile-email" className="block text-sm font-medium text-fg-secondary mb-1 mt-2">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-field mb-1"
                />
                {fieldErrors.email && <p role="alert" className="text-xs text-red-600 mb-2">{fieldErrors.email}</p>}

                <label htmlFor="profile-bio" className="block text-sm font-medium text-fg-secondary mb-1 mt-2">Bio</label>
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={300}
                  placeholder="A short line about yourself..."
                  className="form-field resize-none"
                  aria-describedby="bio-char-count"
                />
                <p id="bio-char-count" className="text-xs text-fg-muted text-right">{bio.length}/300</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <div>
                    <label htmlFor="profile-college" className="block text-sm font-medium text-fg-secondary mb-1">College</label>
                    <input
                      id="profile-college"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="form-field"
                    />
                  </div>
                  <div>
                    <label htmlFor="profile-branch" className="block text-sm font-medium text-fg-secondary mb-1">Branch</label>
                    <input
                      id="profile-branch"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="form-field"
                    />
                  </div>
                </div>

                <label id="skills-label" className="block text-sm font-medium text-fg-secondary mb-1 mt-3">Skills</label>
                <SkillsInput skills={skills} onChange={setSkills} labelledBy="skills-label" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label htmlFor="profile-github" className="block text-sm font-medium text-fg-secondary mb-1">GitHub</label>
                    <input
                      id="profile-github"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="github.com/username"
                      className="form-field"
                    />
                    {fieldErrors.github && <p role="alert" className="text-xs text-red-600 mt-1">{fieldErrors.github}</p>}
                  </div>
                  <div>
                    <label htmlFor="profile-linkedin" className="block text-sm font-medium text-fg-secondary mb-1">LinkedIn</label>
                    <input
                      id="profile-linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="form-field"
                    />
                    {fieldErrors.linkedin && <p role="alert" className="text-xs text-red-600 mt-1">{fieldErrors.linkedin}</p>}
                  </div>
                </div>

                <button
                  disabled={savingProfile}
                  className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-hover disabled:opacity-60 transition-colors"
                >
                  {savingProfile ? "Saving…" : "Save Changes"}
                </button>
              </form>
            </div>
          </FadeIn>

          <div className="space-y-6">
            <FadeIn delay={staggerDelay(1)}>
              <div className="bg-card rounded-2xl shadow-sm p-5">
                {profile.provider === "google" ? (
                  <div>
                    <h3 className="font-semibold text-fg mb-2">Change Password</h3>
                    <p className="text-sm text-fg-muted">
                      This account signs in with Google, so there's no password to change here.
                      Manage your password through your Google account instead.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordSubmit}>
                    <h3 className="font-semibold text-fg mb-3">Change Password</h3>
                    {passwordMsg && <p role="status" className="text-sm text-green-600 mb-2">{passwordMsg}</p>}
                    {passwordError && <p role="alert" className="text-sm text-red-600 mb-2">{passwordError}</p>}

                    <label htmlFor="current-password" className="block text-sm font-medium text-fg-secondary mb-1">Current Password</label>
                    <input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="form-field mb-3"
                    />

                    <label htmlFor="new-password" className="block text-sm font-medium text-fg-secondary mb-1">New Password</label>
                    <input
                      id="new-password"
                      type="password"
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="form-field mb-3"
                    />

                    <label htmlFor="confirm-new-password" className="block text-sm font-medium text-fg-secondary mb-1">Confirm New Password</label>
                    <input
                      id="confirm-new-password"
                      type="password"
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="form-field mb-4"
                    />

                    <button
                      disabled={savingPassword}
                      className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-hover disabled:opacity-60 transition-colors"
                    >
                      {savingPassword ? "Updating…" : "Update Password"}
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={staggerDelay(2)}>
              <DeleteAccountSection hasPassword={profile.provider !== "google"} />
            </FadeIn>
          </div>
        </div>
      </div>
    </Layout>
  );
}
