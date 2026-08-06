import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    duration: "/month",
    description: "Perfect for beginners starting interview preparation.",
    features: [
      "5 AI Mock Interviews",
      "Basic AI Feedback",
      "Resume Score",
      "Interview Analytics",
    ],
    button: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "₹499",
    duration: "/month",
    description: "Ideal for students preparing for placements.",
    features: [
      "Unlimited AI Interviews",
      "Voice Analysis",
      "Resume ATS Checker",
      "Coding Assessment",
      "Performance Dashboard",
      "Priority Support",
    ],
    button: "Start Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    duration: "",
    description: "For colleges and organizations.",
    features: [
      "Unlimited Students",
      "Dedicated Dashboard",
      "Analytics Reports",
      "Admin Panel",
      "API Integration",
      "24/7 Support",
    ],
    button: "Contact Us",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section
      id="pricing"
      className="py-24 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-gray-900">
            Simple & Transparent Pricing
          </h2>

          <p className="mt-5 text-lg text-gray-600">
            Choose the perfect plan to accelerate your interview preparation.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-16">

          {plans.map((plan) => (

            <div
              key={plan.name}
              className={`rounded-3xl p-8 shadow-lg bg-white relative ${
                plan.popular
                  ? "border-2 border-indigo-600 scale-105"
                  : ""
              }`}
            >

              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold">
                {plan.name}
              </h3>

              <p className="text-gray-500 mt-2">
                {plan.description}
              </p>

              <div className="mt-8">

                <span className="text-5xl font-bold">
                  {plan.price}
                </span>

                <span className="text-gray-500">
                  {plan.duration}
                </span>

              </div>

              <button
                className={`mt-8 w-full py-3 rounded-xl font-semibold transition ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                {plan.button}
              </button>

              <div className="mt-8 space-y-4">

                {plan.features.map((feature) => (

                  <div
                    key={feature}
                    className="flex items-center gap-3"
                  >
                    <Check className="text-green-500 w-5 h-5" />

                    <span>{feature}</span>

                  </div>

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
};

export default Pricing;