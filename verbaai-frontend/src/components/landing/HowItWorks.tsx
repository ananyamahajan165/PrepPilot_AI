import {
  Search,
  MessageCircle,
  Brain,
  TrendingUp,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Choose Interview",
    description:
      "Select your role, company, difficulty level, and interview type to get personalized questions.",
  },
  {
    icon: MessageCircle,
    title: "AI Conducts Interview",
    description:
      "Answer AI-generated questions using text or voice just like a real interview.",
  },
  {
    icon: Brain,
    title: "Receive AI Feedback",
    description:
      "Get detailed insights on communication, confidence, technical accuracy, and body language.",
  },
  {
    icon: TrendingUp,
    title: "Track Your Growth",
    description:
      "Monitor your interview history, analytics, and improvement over time through your dashboard.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">
            How VerbaAI Works
          </h2>

          <p className="mt-5 text-lg text-gray-600 max-w-3xl mx-auto">
            Start preparing for interviews in just a few simple steps and
            receive AI-powered insights to continuously improve.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative bg-gray-50 rounded-2xl p-8 shadow hover:shadow-xl transition duration-300"
              >
                <div className="absolute -top-5 left-8 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>

                <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mt-6 mb-6">
                  <Icon className="w-8 h-8 text-indigo-600" />
                </div>

                <h3 className="text-xl font-semibold mb-3">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-7">
                  {step.description}
                </p>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
};

export default HowItWorks;