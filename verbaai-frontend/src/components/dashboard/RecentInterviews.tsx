import { Clock, ArrowRight } from "lucide-react";

const interviews = [
  {
    company: "Google",
    role: "Software Engineer",
    score: 92,
    date: "Today",
    status: "Completed",
  },
  {
    company: "Microsoft",
    role: "Frontend Developer",
    score: 88,
    date: "Yesterday",
    status: "Completed",
  },
  {
    company: "Amazon",
    role: "SDE Intern",
    score: 84,
    date: "2 Days Ago",
    status: "Completed",
  },
  {
    company: "Adobe",
    role: "Backend Developer",
    score: 79,
    date: "Last Week",
    status: "Completed",
  },
];

const RecentInterviews = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="flex justify-between items-center mb-6">

        <div className="flex items-center gap-3">
          <Clock className="text-indigo-600" />
          <h2 className="text-xl font-semibold">
            Recent Interviews
          </h2>
        </div>

        <button className="text-indigo-600 flex items-center gap-2 hover:gap-3 transition-all">
          View All
          <ArrowRight size={18} />
        </button>

      </div>

      <div className="space-y-4">

        {interviews.map((item) => (

          <div
            key={`${item.company}-${item.role}`}
            className="flex justify-between items-center p-5 rounded-xl border hover:shadow-md transition"
          >

            <div>
              <h3 className="font-semibold text-lg">
                {item.company}
              </h3>

              <p className="text-gray-500">
                {item.role}
              </p>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {item.score}%
              </p>

              <span className="text-gray-500 text-sm">
                Score
              </span>
            </div>

            <div className="text-right">

              <p className="text-gray-600">
                {item.date}
              </p>

              <span className="text-green-600 text-sm font-medium">
                {item.status}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default RecentInterviews;