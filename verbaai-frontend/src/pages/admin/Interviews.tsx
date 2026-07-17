import { useEffect, useState } from "react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

import AdminService from "../../services/admin/admin.service";
import type { Interview } from "../../types/interview.types";

const statusStyles: Record<string, string> = {
  Completed: "bg-green-100 text-green-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Pending: "bg-gray-100 text-gray-700",
};

const Interviews = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInterviews = async () => {
      try {
        const data = await AdminService.getInterviews();
        setInterviews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadInterviews();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <div className="flex-1">
        <AdminTopbar title="Interviews" />

        <main className="p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Loading...
            </div>
          ) : interviews.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500">
              No interviews found.
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="p-4">Company</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Difficulty</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Score</th>
                  </tr>
                </thead>

                <tbody>
                  {interviews.map((interview) => (
                    <tr
                      key={interview._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="p-4 font-medium">
                        {interview.company}
                      </td>
                      <td className="p-4 text-gray-600">{interview.role}</td>
                      <td className="p-4 text-gray-600">{interview.type}</td>
                      <td className="p-4 text-gray-600">
                        {interview.difficulty}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusStyles[interview.status]
                          }`}
                        >
                          {interview.status}
                        </span>
                      </td>
                      <td className="p-4 font-semibold">
                        {interview.overallScore}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Interviews;
