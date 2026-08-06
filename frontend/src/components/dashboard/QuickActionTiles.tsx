import { Link } from "react-router-dom";
import { FadeIn, staggerDelay } from "../ui/motion";
import { MicIcon, TargetIcon, LayersIcon, ArrowRightIcon } from "./icons";

const actions = [
  {
    to: "/communication-coach",
    label: "Start Communication Practice",
    desc: "Get scored on confidence and clarity",
    icon: MicIcon,
  },
  {
    to: "/interview",
    label: "Start Mock Interview",
    desc: "Practice a technical or HR question",
    icon: TargetIcon,
  },
  {
    to: "/resume",
    label: "Analyze Resume",
    desc: "Get your ATS score in seconds",
    icon: LayersIcon,
  },
];

export default function QuickActionTiles() {
  return (
    <div>
      <p className="text-sm font-semibold text-fg mb-3">Quick actions</p>
      <div className="grid sm:grid-cols-3 gap-6">
        {actions.map((action, i) => (
          <FadeIn key={action.to} delay={staggerDelay(i)}>
            <Link
              to={action.to}
              className="group h-full flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <action.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-fg flex items-center gap-1.5">
                  {action.label}
                  <ArrowRightIcon className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-fg-secondary mt-1">{action.desc}</p>
              </div>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
