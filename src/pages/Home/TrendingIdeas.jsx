import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import IdeaCard from "../../components/IdeaCard";
import { HiFire, HiArrowRight } from "react-icons/hi";

const TrendingIdeas = () => {
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/ideas/trending`
        );
        setIdeas(res.data);
      } catch (err) {
        console.error("Failed to load trending ideas:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <section className="py-20 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HiFire size={22} className="text-orange-500" />
              <span className="text-sm font-semibold text-orange-500 uppercase tracking-wider">
                Hot Right Now
              </span>
            </div>
            <h2 className="section-title">Trending Ideas</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-lg">
              The most exciting startup concepts the community is buzzing about
              this week.
            </p>
          </div>
          <Link
            to="/ideas"
            className="btn-outline shrink-0 self-start sm:self-auto"
          >
            View All Ideas
            <HiArrowRight size={16} />
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="card p-5 animate-pulse">
                <div className="h-44 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!isLoading && hasError && (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500 text-lg">
              Could not load trending ideas right now.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !hasError && ideas.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-xl font-heading font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No ideas yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Be the first to share a startup idea!
            </p>
            <Link to="/add-idea" className="btn-primary">
              Submit an Idea
            </Link>
          </div>
        )}

        {/* Ideas grid */}
        {!isLoading && !hasError && ideas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingIdeas;