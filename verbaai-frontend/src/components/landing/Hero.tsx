const Hero = () => {
  return (
    <section className="pt-32 pb-24 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-6">
              🚀 AI-Powered Interview Preparation
            </span>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              Crack Your Dream Job With
              <span className="text-indigo-600"> VerbaAI</span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 leading-8">
              Practice HR and Technical interviews with AI, receive instant
              feedback, improve confidence, communication, and track your
              progress through detailed analytics.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3 rounded-lg font-semibold transition">
                Start Free
              </button>

              <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50 px-7 py-3 rounded-lg font-semibold transition">
                Watch Demo
              </button>
            </div>

            <div className="mt-10 flex gap-10">
              <div>
                <h2 className="text-3xl font-bold text-indigo-600">10K+</h2>
                <p className="text-gray-500">Mock Interviews</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-indigo-600">95%</h2>
                <p className="text-gray-500">Success Rate</p>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-indigo-600">24/7</h2>
                <p className="text-gray-500">AI Available</p>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl p-8">

              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-semibold">
                  Live Interview Analysis
                </h3>

                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm">
                  Live
                </span>
              </div>

              <div className="space-y-6">

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Confidence</span>
                    <span>92%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full w-[92%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Communication</span>
                    <span>88%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-indigo-500 h-3 rounded-full w-[88%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span>Technical Skills</span>
                    <span>95%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full w-[95%]"></div>
                  </div>
                </div>

              </div>

              <div className="mt-8 bg-indigo-50 rounded-xl p-4">
                <h4 className="font-semibold mb-2">
                  AI Feedback
                </h4>

                <p className="text-gray-600 text-sm">
                  Great eye contact and communication. Try providing more
                  detailed examples while answering behavioural questions.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;