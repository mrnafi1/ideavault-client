const steps = [
  {
    number: "01",
    icon: "✍️",
    title: "Submit Your Idea",
    description:
      "Fill in your idea details — title, description, category, target audience, and problem statement. Takes less than 5 minutes.",
    color: "bg-primary-50 dark:bg-primary-950 border-primary-200 dark:border-primary-800",
    numberColor: "text-primary-600 dark:text-primary-400",
  },
  {
    number: "02",
    icon: "🌍",
    title: "Get Community Feedback",
    description:
      "Fellow innovators comment, ask questions, and provide honest feedback to help you refine and strengthen your concept.",
    color: "bg-violet-50 dark:bg-violet-950 border-violet-200 dark:border-violet-800",
    numberColor: "text-violet-600 dark:text-violet-400",
  },
  {
    number: "03",
    icon: "🚀",
    title: "Validate & Build",
    description:
      "Use community insights to validate your idea, find collaborators, and confidently move forward to building your startup.",
    color: "bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800",
    numberColor: "text-emerald-600 dark:text-emerald-400",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="section-title mt-2">How IdeaVault Works</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto">
            From idea to validation in three simple steps. No complicated setup,
            just pure innovation.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gray-200 dark:bg-gray-700 z-0" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative z-10 border-2 rounded-2xl p-8 text-center transition-transform hover:-translate-y-1 duration-300 ${step.color}`}
            >
              {/* Step number */}
              <span className={`text-5xl font-heading font-black ${step.numberColor} opacity-20 absolute top-4 right-5`}>
                {step.number}
              </span>

              {/* Icon */}
              <div className="text-5xl mb-5">{step.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;