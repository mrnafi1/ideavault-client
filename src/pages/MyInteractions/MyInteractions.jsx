import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

const InteractionCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const { idea, comments } = item;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex justify-between mb-3">
        <span className="px-2.5 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">{idea?.category || "Unknown"}</span>
        <span className="text-sm font-medium text-indigo-600">{comments.length} comments</span>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">{idea?.title || "Idea Unavailable"}</h3>
      
      <button onClick={() => setExpanded(!expanded)} className="text-xs text-gray-500 hover:text-indigo-600 mb-2">
        {expanded ? "Hide" : "Show"} my comments
      </button>
      
      {expanded && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2 max-h-48 overflow-y-auto mb-4">
          {comments.map((c) => (
            <div key={c._id} className="py-2 border-b border-gray-200 dark:border-gray-600 last:border-0 text-sm text-gray-700 dark:text-gray-300">
              {c.commentText}
            </div>
          ))}
        </div>
      )}
      
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <span className="text-xs text-gray-400">{idea?.authorName || "Unknown"}</span>
        <Link to={`/ideas/${idea?._id}`} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">View Idea</Link>
      </div>
    </div>
  );
};

const MyInteractions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user?.email) fetchInteractions(); }, [user]);

  const fetchInteractions = async () => {
    try {
      const res = await axiosSecure.get(`/api/comments/user/${user.email}`);
      setInteractions(res.data);
    } catch { toast.error("Failed to load interactions."); } finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Interactions</h1>
        {interactions.length === 0 ? (
          <p className="text-gray-500">You haven't commented on any ideas yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {interactions.map((item) => (
              <InteractionCard key={item.idea?._id || item.comments[0]?.ideaId} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInteractions;