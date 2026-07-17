import { useEffect, useState } from "react";

import AdminService from "../services/admin/admin.service";
import StatCard from "../components/dashboard/StatCard";

import {
  Users,
  Briefcase,
  Trophy,
  BarChart3,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalInterviews: number;
  completedInterviews: number;
  averageScore: number;
}

const Admin = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await AdminService.getDashboard();
        setStats(data as DashboardStats);
      } catch {
        setError("Unable to load admin dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Users"
          value={stats.totalUsers.toString()}
          change="+12%"
          icon={<Users />}
        />

        <StatCard
          title="Interviews"
          value={stats.totalInterviews.toString()}
          change="+9%"
          icon={<Briefcase />}
        />

        <StatCard
          title="Completed"
          value={stats.completedInterviews.toString()}
          change="+5%"
          icon={<Trophy />}
        />

        <StatCard
          title="Average Score"
          value={`${stats.averageScore}%`}
          change="+3%"
          icon={<BarChart3 />}
        />
      </div>
    </div>
  );
};

export default Admin;
