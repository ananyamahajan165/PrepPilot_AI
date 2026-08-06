import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Mic,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/admin/analytics",
  },
  {
    title: "Interviews",
    icon: Mic,
    path: "/admin/interviews",
  },
];

const AdminSidebar = () => {
  return (
    <aside className="w-72 bg-white shadow-lg h-screen p-6">
      <h1 className="text-3xl font-bold text-indigo-600 mb-10">
        VerbaAI Admin
      </h1>

      <nav className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `w-full flex items-center gap-4 p-4 rounded-xl transition ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-indigo-50 hover:text-indigo-600"
                }`
              }
            >
              <Icon size={22} />
              <span className="font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
