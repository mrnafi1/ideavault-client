import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { HiPencil, HiTrash, HiCheck, HiX } from "react-icons/hi";

const CommentItem = ({ comment, currentUserEmail, onUpdate, onDelete }) => {
  const axiosSecure = useAxiosSecure();

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUserEmail === comment.userEmail;

  const commentDate = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Just now";

  const handleSaveEdit = async () => {
    if (!editedText.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      await axiosSecure.put(`/api/comments/${comment._id}`, {
        commentText: editedText.trim(),
      });
      onUpdate(comment._id, editedText.trim());
      setIsEditing(false);
      toast.success("Comment updated! ✏️");
    } catch (error) {
      toast.error("Failed to update comment.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedText(comment.commentText);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axiosSecure.delete(`/api/comments/${comment._id}`);
      onDelete(comment._id);
      setShowDeleteModal(false);
      toast.success("Comment deleted.");
    } catch (error) {
      toast.error("Failed to delete comment.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex gap-3 group">
        {/* User avatar */}
        <img
          src={
            comment.userPhoto ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              comment.userName || "User"
            )}&background=6366f1&color=fff`
          }
          alt={comment.userName}
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
        />

        {/* Comment content */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">
                {comment.userName || "Anonymous"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {commentDate}
                {comment.updatedAt &&
                  new Date(comment.updatedAt).getTime() >
                    new Date(comment.createdAt).getTime() && (
                    <span className="ml-1">(edited)</span>
                  )}
              </p>
            </div>

            {/* Edit/Delete buttons - only show for owner */}
            {isOwner && !isEditing && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400"
                  title="Edit comment"
                >
                  <HiPencil size={14} />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition text-red-600 dark:text-red-400"
                  title="Delete comment"
                >
                  <HiTrash size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Comment text or edit form */}
          {isEditing ? (
            <div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={3}
                className="input-field w-full resize-none text-sm mb-2"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white text-sm px-3 py-1.5 rounded-lg transition disabled:opacity-60"
                >
                  <HiCheck size={14} />
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm px-3 py-1.5 rounded-lg transition"
                >
                  <HiX size={14} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {comment.commentText}
            </p>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-3">
              Delete Comment?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this comment? This action cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-xl transition disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold px-4 py-2.5 rounded-xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommentItem;