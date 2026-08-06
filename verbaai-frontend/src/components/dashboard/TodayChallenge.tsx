import { Trophy, ArrowRight } from "lucide-react";

const TodayChallenge = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">

      <div className="flex items-center gap-3 mb-4">

        <Trophy size={28} />

        <h2 className="text-2xl font-bold">
          Today's Challenge
        </h2>

      </div>

      <p className="text-indigo-100 leading-8">
        Complete one Technical Mock Interview and improve your confidence score
        by earning AI recommendations.
      </p>

      <button className="mt-8 bg-white text-indigo-600 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold hover:scale-105 transition">

        Start Challenge

        <ArrowRight size={18} />

      </button>

    </div>
  );
};

export default TodayChallenge;