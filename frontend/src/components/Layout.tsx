import { ReactNode } from "react";
import Navbar from "./Navbar";

export default function Layout({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`${wide ? "max-w-[1500px] px-12 pt-12 pb-16" : "max-w-5xl px-6 py-8"} mx-auto text-fg`}>{children}</main>
    </div>
  );
}
