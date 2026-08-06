import {
  Mic,
  BarChart3,
  Trophy,
  TrendingUp,
} from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import WeeklyProgressChart from "../components/dashboard/WeeklyProgressChart";
import GrowthRings from "../components/dashboard/GrowthRings";
import TodayChallenge from "../components/dashboard/TodayChallenge";
import RecentInterviews from "../components/dashboard/RecentInterviews";

const Dashboard = () => {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-4xl font-bold">
            Welcome Back 👋
          </h1>

          <p className="text-gray-500 mt-2">
            Track your interview preparation and improve every day.
          </p>

        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

          <StatCard
            title="Interviews"
            value="48"
            change="+18%"
            icon={<Mic className="text-indigo-600" />}
          />

          <StatCard
            title="Average Score"
            value="88%"
            change="+12%"
            icon={<BarChart3 className="text-indigo-600" />}
          />

          <StatCard
            title="Challenges"
            value="26"
            change="+6%"
            icon={<Trophy className="text-indigo-600" />}
          />

          <StatCard
            title="Confidence"
            value="92%"
            change="+10%"
            icon={<TrendingUp className="text-indigo-600" />}
          />

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <WeeklyProgressChart />

          <GrowthRings />

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          <TodayChallenge />

          <RecentInterviews />

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Dashboard;