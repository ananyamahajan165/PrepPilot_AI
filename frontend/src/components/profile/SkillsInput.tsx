import { KeyboardEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SkillsInput({
  skills,
  onChange,
  labelledBy,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
  labelledBy?: string;
}) {
  const [draft, setDraft] = useState("");

  function addSkill() {
    const value = draft.trim();
    if (!value) return;
    if (!skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
      onChange([...skills, value]);
    }
    setDraft("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    } else if (e.key === "Backspace" && !draft && skills.length > 0) {
      onChange(skills.slice(0, -1));
    }
  }

  function removeSkill(skill: string) {
    onChange(skills.filter((s) => s !== skill));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 bg-surface-secondary border border-border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary">
        <AnimatePresence initial={false}>
          {skills.map((skill) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-1.5 bg-primary/10 text-primary-hover text-xs font-medium rounded-full pl-2.5 pr-1.5 py-1"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                aria-label={`Remove ${skill}`}
                className="w-4 h-4 rounded-full hover:bg-primary/10 flex items-center justify-center"
              >
                ×
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addSkill}
          placeholder={skills.length === 0 ? "Type a skill and press Enter…" : "Add another…"}
          aria-labelledby={labelledBy}
          aria-describedby="skills-hint"
          className="flex-1 min-w-[120px] text-sm bg-transparent text-fg placeholder:text-fg-muted outline-none py-1"
        />
      </div>
      <p id="skills-hint" className="text-xs text-fg-muted mt-1">Press Enter or comma to add a skill</p>
    </div>
  );
}
