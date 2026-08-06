import {
  LayoutDashboard,
  Mic,
  FileText,
  BarChart3,
  Settings,
  User,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Mock Interview",
    icon: Mic,
  },
  {
    title: "Resume Analyzer",
    icon: FileText,
  },
  {
    title: "Analytics",
    icon: BarChart3,
  },
  {
    title: "Profile",
    icon: User,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside className="w-72 bg-white shadow-lg h-screen p-6">

      <h1 className="text-3xl font-bold text-indigo-600 mb-10">
        VerbaAI
      </h1>

      <nav className="space-y-3">

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <Icon size={22} />
              <span className="font-medium">
                {item.title}
              </span>
            </button>
          );
        })}

      </nav>

    </aside>
  );
};

export default Sidebar;