import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiHome, HiArrowLeft, HiLightBulb } from "react-icons/hi";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 – Page Not Found | IdeaVault";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Graphic */}
        <div className="relative inline-flex items-center justify-center w-32 h-32 mb-8">
          <div className="absolute inset-0 bg-primary-100 dark:bg-primary-950 rounded-full animate-pulse" />
          <span className="relative text-6xl">💡</span>
        </div>

        {/* Error code */}
        <h1 className="text-8xl font-heading font-extrabold text-primary-600 dark:text-primary-400 leading-none mb-4">
          404
        </h1>

        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-3">
          This idea doesn't exist yet
        </h2>

        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
          The page you're looking for may have been moved, deleted, or perhaps
          never existed. Let's get you back to discovering great ideas.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn-primary px-6 py-3">
            <HiHome size={18} />
            Go Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="btn-outline px-6 py-3"
          >
            <HiArrowLeft size={18} />
            Go Back
          </button>
          <Link to="/ideas" className="btn-outline px-6 py-3">
            <HiLightBulb size={18} />
            Explore Ideas
          </Link>
        </div>
      </div>
    </div>
  );
};







export default NotFound;
