import {
  Bell,
  Search,
} from "lucide-react";

const Topbar = () => {
  return (
    <header className="bg-white shadow-sm p-6 flex justify-between items-center">

      <div className="relative">

        <Search
          className="absolute left-3 top-3 text-gray-400"
          size={18}
        />

        <input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-5 py-3 rounded-xl border w-96 focus:outline-none"
        />

      </div>

      <div className="flex items-center gap-6">

        <Bell
          className="cursor-pointer"
          size={24}
        />

        <img
          src="https://i.pravatar.cc/150"
          alt="profile"
          className="w-12 h-12 rounded-full"
        />

      </div>

    </header>
  );
};

export default Topbar;