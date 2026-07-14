import { CheckCircle, TrendingUp, Mic, Brain } from "lucide-react";

const progress = [
  {
    title: "Confidence",
    value: 92,
    color: "bg-green-500",
    icon: TrendingUp,
  },
  {
    title: "Communication",
    value: 88,
    color: "bg-indigo-500",
    icon: Mic,
  },
  {
    title: "Technical Skills",
    value: 84,
    color: "bg-blue-500",
    icon: Brain,
  },
];

const ConfidenceBuilder = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Side */}

          <div>

            <span className="text-indigo-600 font-semibold uppercase tracking-wider">
              Confidence Builder
            </span>

            <h2 className="text-4xl font-bold mt-4 text-gray-900">
              Become Interview Ready with AI
            </h2>

            <p className="mt-6 text-gray-600 text-lg leading-8">
              Every interview session improves your communication,
              confidence, technical understanding, and speaking ability.
              Track your progress and become placement ready.
            </p>

            <div className="mt-8 space-y-5">

              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" />
                <span>AI analyzes confidence level</span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" />
                <span>Tracks communication improvement</span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" />
                <span>Detects filler words automatically</span>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" />
                <span>Personalized interview recommendations</span>
              </div>

            </div>

          </div>

          {/* Right Side */}

          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h3 className="text-2xl font-semibold mb-8">
              AI Performance Report
            </h3>

            {progress.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="mb-8"
                >
                  <div className="flex justify-between mb-2">

                    <div className="flex items-center gap-2">
                      <Icon className="text-indigo-600 w-5 h-5" />
                      <span className="font-medium">
                        {item.title}
                      </span>
                    </div>

                    <span>{item.value}%</span>

                  </div>

                  <div className="w-full h-3 rounded-full bg-gray-200">

                    <div
                      className={`${item.color} h-3 rounded-full`}
                      style={{ width: `${item.value}%` }}
                    ></div>

                  </div>

                </div>
              );
            })}

            <div className="mt-10 p-5 rounded-xl bg-indigo-100">

              <h4 className="font-semibold text-indigo-700">
                AI Recommendation
              </h4>

              <p className="mt-2 text-gray-700">
                Your confidence has improved by 18% this week.
                Practice one more Technical Mock Interview to
                reach the Expert level.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ConfidenceBuilder;