import { useEffect, useState } from "react";
import { Users, Briefcase, Trophy, BarChart3 } from "lucide-react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import StatsCard from "../../components/admin/StatsCard";

import AdminService, { type AdminDashboardStats } from "../../services/admin/admin.service";

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0,
    totalInterviews: 0,
    completedInterviews: 0,
    averageScore: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await AdminService.getDashboard();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminTopbar title="Dashboard" />

        <main className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Loading...
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Users"
                value={stats.totalUsers.toString()}
                change="+12%"
                icon={<Users />}
              />

              <StatsCard
                title="Interviews"
                value={stats.totalInterviews.toString()}
                change="+9%"
                icon={<Briefcase />}
              />

              <StatsCard
                title="Completed"
                value={stats.completedInterviews.toString()}
                change="+5%"
                icon={<Trophy />}
              />

              <StatsCard
                title="Average Score"
                value={`${stats.averageScore}%`}
                change="+3%"
                icon={<BarChart3 />}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
