import { TrendingUp } from "lucide-react";

const skills = [
  {
    title: "Confidence",
    value: 92,
    color: "#4F46E5",
  },
  {
    title: "Communication",
    value: 86,
    color: "#10B981",
  },
  {
    title: "Technical",
    value: 80,
    color: "#F59E0B",
  },
];

const GrowthRings = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">

      <div className="flex items-center gap-3 mb-8">

        <TrendingUp className="text-indigo-600" />

        <h2 className="text-xl font-semibold">
          Skill Growth
        </h2>

      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {skills.map((skill) => {

          const radius = 55;
          const circumference = 2 * Math.PI * radius;
          const offset =
            circumference -
            (skill.value / 100) * circumference;

          return (
            <div
              key={skill.title}
              className="flex flex-col items-center"
            >

              <svg
                width="140"
                height="140"
              >

                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke="#E5E7EB"
                  strokeWidth="10"
                  fill="none"
                />

                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  stroke={skill.color}
                  strokeWidth="10"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  transform="rotate(-90 70 70)"
                />

                <text
                  x="70"
                  y="75"
                  textAnchor="middle"
                  fontSize="22"
                  fontWeight="bold"
                >
                  {skill.value}%
                </text>

              </svg>

              <h3 className="mt-4 font-semibold">
                {skill.title}
              </h3>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default GrowthRings;