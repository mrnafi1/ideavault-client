import { Link } from "react-router-dom";
import { HiTag, HiCalendar, HiUser, HiArrowRight } from "react-icons/hi";

const categoryColors = {
  Tech: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Health: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  AI: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  Education: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  Finance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  Others: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

const IdeaCard = ({ idea }) => {
  const { _id, title, shortDescription, category, authorName, createdAt, imageURL, tags } = idea;

  const categoryStyle = categoryColors[category] || categoryColors["Others"];

  const postedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="card flex flex-col h-full overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-primary-100 to-indigo-100 dark:from-gray-700 dark:to-gray-800">
        {imageURL ? (
          <img
            src={imageURL}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            💡
          </div>
        )}

        {/* Category badge on image */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${categoryStyle}`}>
          {category || "Others"}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Short description */}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 flex-1 mb-4">
          {shortDescription}
        </p>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            <HiTag size={13} className="text-gray-400" />
            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <HiUser size={13} />
              {authorName || "Anonymous"}
            </span>
            <span className="flex items-center gap-1">
              <HiCalendar size={13} />
              {postedDate}
            </span>
          </div>

          <Link
            to={`/ideas/${_id}`}
            className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:gap-2 transition-all duration-200"
          >
            View Details
            <HiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IdeaCard;