import { ReactNode } from "react";
import Navbar from "./Navbar";

// Every authenticated page shares this shell and gets the standard reading
// width (max-w-5xl) by default. Dashboard is the one exception — it's meant
// to feel like a dense product surface, not a document, so it opts into a
// wider container via this prop rather than changing the shared default
// (which would affect Profile, Interview, Resume, etc. too).
export default function Layout({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`${wide ? "max-w-[1500px] px-12 pt-12 pb-16" : "max-w-5xl px-6 py-8"} mx-auto text-fg`}>{children}</main>
    </div>
  );
}
