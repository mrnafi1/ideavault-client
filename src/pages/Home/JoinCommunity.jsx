import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const stats = [
  { value: "5,000+", label: "Ideas Shared" },
  { value: "12,000+", label: "Innovators" },
  { value: "30+", label: "Categories" },
  { value: "98%", label: "Satisfaction Rate" },
];

const JoinCommunity = () => {
  const { user } = useAuth();

  return (
    <section className="py-20 bg-gradient-to-br from-primary-700 via-indigo-700 to-primary-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 pb-16 border-b border-white/20">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-heading font-extrabold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-primary-200 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div className="text-center">
          <h2 className="text-4xl sm:text-5xl font-heading font-extrabold text-white leading-tight mb-5">
            Ready to Share Your
            <br />
            <span className="text-yellow-300">Next Big Idea?</span>
          </h2>
          <p className="text-primary-200 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of founders and innovators who are already validating
            ideas and finding co-founders on IdeaVault.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {user ? (
              <Link
                to="/add-idea"
                className="bg-white text-primary-700 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl text-base transition shadow-lg"
              >
                Submit Your Idea 🚀
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-white text-primary-700 hover:bg-gray-100 font-bold px-8 py-4 rounded-xl text-base transition shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/ideas"
                  className="bg-white/15 backdrop-blur hover:bg-white/25 text-white font-semibold px-8 py-4 rounded-xl border border-white/30 transition text-base"
                >
                  Browse Ideas
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};



export default JoinCommunity;