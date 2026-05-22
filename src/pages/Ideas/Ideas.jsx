import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import IdeaCard from "../../components/IdeaCard";
import { HiSearch, HiFilter, HiX } from "react-icons/hi";

const categoryOptions = ["All", "Tech", "Health", "AI", "Education", "Finance", "Others"];

const Ideas = () => {
  const [ideas, setIdeas] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // searchInput is what the user is typing — only applied on submit
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    document.title = "Explore Ideas – IdeaVault";
    fetchIdeas("", "All"); // load all ideas on mount
  }, []);

  // ─── Fetch from server with query params (uses $regex on the server) ────────
  const fetchIdeas = async (search, category) => {
    setIsLoading(true);
    try {
      const params = {};

      if (search?.trim()) params.search = search.trim();
      if (category && category !== "All") params.category = category;

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ideas`,
        { params }
      );

      setIdeas(res.data);

      // keep a total count only on the initial unfiltered load
      if (!search && category === "All") {
        setTotalCount(res.data.length);
      }
    } catch (err) {
      console.error("Failed to fetch ideas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Search on form submit (Enter or button click) ───────────────────────────
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    fetchIdeas(searchInput, selectedCategory);
  };

  // ─── Category change triggers immediate server fetch ─────────────────────────
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    fetchIdeas(searchTerm, cat);
  };

  // ─── Clear all filters and reload ────────────────────────────────────────────
  const handleClearFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setSelectedCategory("All");
    fetchIdeas("", "All");
  };

  const hasActiveFilters = searchTerm || selectedCategory !== "All";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-heading font-bold text-gray-900 dark:text-white mb-3">
            Explore Startup Ideas
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Browse innovative concepts from founders around the world. Search by title or filter by category.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="card p-6 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col lg:flex-row gap-4"
          >
            {/* Search input */}
            <div className="flex-1 relative">
              <HiSearch
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search ideas by title..."
                className="input-field pl-11 pr-10"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <HiX size={18} />
                </button>
              )}
            </div>

            {/* Category filter */}
            <div className="relative lg:w-56">
              <HiFilter
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="input-field pl-11 appearance-none cursor-pointer"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Search button */}
            <button type="submit" className="btn-primary whitespace-nowrap">
              Search
            </button>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn-outline whitespace-nowrap"
              >
                Clear Filters
              </button>
            )}
          </form>

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Active filters:</span>
              {searchTerm && (
                <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">
                  "{searchTerm}"
                </span>
              )}
              {selectedCategory !== "All" && (
                <span className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">
                  {selectedCategory}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results summary */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {isLoading
              ? "Loading ideas..."
              : hasActiveFilters
              ? `Found ${ideas.length} idea${ideas.length !== 1 ? "s" : ""}`
              : `Showing all ${ideas.length} ideas`}
          </p>
        </div>

        {/* Loading skeleton */}
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

        
        {!isLoading && ideas.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-heading font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No ideas found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {hasActiveFilters
                ? "Try adjusting your filters or search term."
                : "Be the first to share a startup idea!"}
            </p>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="btn-primary">
                Clear Filters
              </button>
            )}
          </div>
        )}

      
        {!isLoading && ideas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ideas;