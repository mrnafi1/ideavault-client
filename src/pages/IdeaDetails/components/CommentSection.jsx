import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import CommentItem from "./CommentItem";
import { HiChatAlt2 } from "react-icons/hi";

const CommentSection = ({ ideaId }) => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [ideaId]);

  const fetchComments = async () => {
    try {
      const response = await axiosSecure.get(`/api/comments/${ideaId}`);
      setComments(response.data);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    try {
      const newComment = {
        ideaId,
        commentText: commentText.trim(),
        userName: user.displayName || "Anonymous",
        userEmail: user.email,
        userPhoto: user.photoURL || "",
      };

      const response = await axiosSecure.post("/api/comments", newComment);
      
      setComments((prev) => [response.data, ...prev]);
      setCommentText("");
      toast.success("Comment posted! 💬");
    } catch (error) {
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateComment = (commentId, updatedText) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment._id === commentId
          ? { ...comment, commentText: updatedText, updatedAt: new Date() }
          : comment
      )
    );
  };

  const handleDeleteComment = (commentId) => {
    setComments((prev) => prev.filter((comment) => comment._id !== commentId));
  };

  return (
    <div className="card p-8">
      <div className="flex items-center gap-3 mb-6">
        <HiChatAlt2 size={24} className="text-primary-600 dark:text-primary-400" />
        <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
          Comments ({comments.length})
        </h2>
      </div>

      {/* Add comment form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start gap-3">
            <img
              src={
                user.photoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.displayName || "User"
                )}&background=6366f1&color=fff`
              }
              alt={user.displayName}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800"
            />
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts on this idea..."
                rows={3}
                className="input-field resize-none mb-3"
              />
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to leave a comment.
          </p>
        </div>
      )}

      {/* Comments list */}
      {isLoadingComments ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="animate-pulse flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">💬</div>
          <p className="text-gray-500 dark:text-gray-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUserEmail={user?.email}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;