import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import type { AdminDashboardStats } from "../../../services/admin/admin.service";

interface AnalyticsChartProps {
  stats: AdminDashboardStats;
}

const AnalyticsChart = ({ stats }: AnalyticsChartProps) => {
  const data = [
    {
      name: "Total Users",
      value: stats.totalUsers,
    },
    {
      name: "Total Interviews",
      value: stats.totalInterviews,
    },
    {
      name: "Completed",
      value: stats.completedInterviews,
    },
    {
      name: "Avg Score",
      value: stats.averageScore,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-lg font-semibold mb-6">Platform Overview</h3>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={13} />
          <YAxis stroke="#9ca3af" fontSize={13} />
          <Tooltip />
          <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
