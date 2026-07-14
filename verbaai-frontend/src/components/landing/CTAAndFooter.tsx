const socialLinks = ["GitHub", "LinkedIn", "X", "Instagram", "Facebook"];

const CTAAndFooter = () => {
  return (
    <>
      {/* CTA Section */}

      <section className="py-24 bg-indigo-600">
        <div className="max-w-6xl mx-auto text-center px-6">

          <h2 className="text-5xl font-bold text-white">
            Ready To Crack Your Dream Interview?
          </h2>

          <p className="mt-6 text-indigo-100 text-lg max-w-2xl mx-auto">
            Join thousands of students preparing smarter with AI-powered mock
            interviews, resume analysis, and real-time feedback.
          </p>

          <div className="mt-10 flex justify-center gap-5 flex-wrap">

            <button className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition">
              Start Free
            </button>

            <button className="border border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-indigo-600 transition">
              Watch Demo
            </button>

          </div>

        </div>
      </section>

      {/* Footer */}

      <footer className="bg-gray-900 text-gray-300">

        <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-5 md:grid-cols-2 gap-12">

          {/* Logo */}

          <div>

            <h2 className="text-3xl font-bold text-white">
              VerbaAI
            </h2>

            <p className="mt-5 leading-7">
              AI-powered interview preparation platform helping students improve
              confidence, communication, coding, and technical interview skills.
            </p>

          </div>

          {/* Product */}

          <div>

            <h3 className="text-white font-semibold mb-5">
              Product
            </h3>

            <ul className="space-y-3">
              <li>Mock Interviews</li>
              <li>Resume Analyzer</li>
              <li>AI Feedback</li>
              <li>Analytics</li>
            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="text-white font-semibold mb-5">
              Company
            </h3>

            <ul className="space-y-3">
              <li>About</li>
              <li>Careers</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>

          </div>

          {/* Resources */}

          <div>

            <h3 className="text-white font-semibold mb-5">
              Resources
            </h3>

            <ul className="space-y-3">
              <li>Documentation</li>
              <li>Support</li>
              <li>FAQs</li>
              <li>Community</li>
            </ul>

          </div>

          {/* Newsletter */}

          <div>

            <h3 className="text-white font-semibold mb-5">
              Stay Updated
            </h3>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg text-black mb-4"
            />

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg font-semibold">
              Subscribe
            </button>

          </div>

        </div>

        <div className="border-t border-gray-700">

          <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">

            <p className="text-sm">
              © 2026 VerbaAI. All Rights Reserved.
            </p>

            <div className="flex gap-3 mt-5 md:mt-0">

              {socialLinks.map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="grid h-9 w-9 place-items-center rounded-full border border-gray-700 text-xs font-semibold transition hover:border-white hover:text-white"
                >
                  {social.charAt(0)}
                </a>
              ))}

            </div>

          </div>

        </div>

      </footer>
    </>
  );
};

export default CTAAndFooter;
