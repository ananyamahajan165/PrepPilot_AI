import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  icon: ReactNode;
}

const StatsCard = ({ title, value, change, icon }: StatsCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>

          {change && (
            <div className="flex items-center gap-1 mt-3 text-green-600 text-sm">
              <ArrowUpRight size={16} />
              {change}
            </div>
          )}
        </div>

        <div className="bg-indigo-100 p-4 rounded-xl">{icon}</div>
      </div>
    </div>
  );
};

export default StatsCard;
