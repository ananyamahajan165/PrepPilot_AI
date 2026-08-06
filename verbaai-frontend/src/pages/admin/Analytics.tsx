import { useEffect, useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import AnalyticsChart from "../../components/admin/AnalyticsChart";

import AdminService, {
  type AdminDashboardStats,
} from "../../services/admin/admin.service";

const Analytics = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await AdminService.getDashboard();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminTopbar title="Analytics" />

        <main className="p-8">
          {loading || !stats ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Loading...
            </div>
          ) : (
            <AnalyticsChart stats={stats} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Analytics;
