import { Bell, ShieldCheck } from "lucide-react";

interface AdminTopbarProps {
  title: string;
}

const AdminTopbar = ({ title }: AdminTopbarProps) => {
  return (
    <header className="bg-white shadow-sm p-6 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <ShieldCheck className="text-indigo-600" size={22} />
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="flex items-center gap-6">
        <Bell className="cursor-pointer text-gray-500" size={24} />

        <img
          src="https://i.pravatar.cc/150?img=12"
          alt="admin profile"
          className="w-11 h-11 rounded-full"
        />
      </div>
    </header>
  );
};

export default AdminTopbar;
