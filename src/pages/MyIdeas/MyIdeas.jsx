import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import LoadingSpinner from "../../components/LoadingSpinner";
import toast from "react-hot-toast";

const CATEGORIES = ["Tech", "Health", "AI", "Education", "Finance", "Others"];

const EMPTY_FORM = {
  title: "", shortDescription: "", detailedDescription: "", category: "",
  tags: [], imageURL: "", estimatedBudget: "", targetAudience: "",
  problemStatement: "", proposedSolution: "",
};

const DeleteModal = ({ idea, onClose, onConfirm, deleting }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <span className="text-3xl">⚠️</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Delete Idea?</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          You're about to permanently delete "{idea?.title}". This action cannot be undone.
        </p>
        <div className="flex gap-3 w-full mt-2">
          <button onClick={onClose} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:text-gray-300">Cancel</button>
          <button onClick={onConfirm} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium">{deleting ? "Deleting..." : "Delete"}</button>
        </div>
      </div>
    </div>
  </div>
);

const UpdateModal = ({ formData, setFormData, onClose, onSubmit, updating }) => {
  const [tagInput, setTagInput] = useState("");
  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, "");
      if (newTag && !formData.tags.includes(newTag) && formData.tags.length < 5) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      setTagInput("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-gray-700 my-auto p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Update Idea</h2>
        <div className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className={inputClass} />
          <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="Short Description" className={inputClass} rows={2} />
          <textarea name="detailedDescription" value={formData.detailedDescription} onChange={handleChange} placeholder="Detailed Description" className={inputClass} rows={3} />
          <input name="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="Target Audience" className={inputClass} />
          <textarea name="problemStatement" value={formData.problemStatement} onChange={handleChange} placeholder="Problem Statement" className={inputClass} rows={2} />
          <textarea name="proposedSolution" value={formData.proposedSolution} onChange={handleChange} placeholder="Proposed Solution" className={inputClass} rows={2} />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} disabled={updating} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:text-gray-300">Cancel</button>
          <button onClick={onSubmit} disabled={updating} className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white">{updating ? "Saving..." : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
};

const IdeaRow = ({ idea, index, onUpdate, onDelete }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{idea.title}</h3>
        <p className="text-sm text-gray-500 mt-1">{idea.shortDescription}</p>
      </div>
      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">{idea.category}</span>
    </div>
    <div className="flex gap-2 mt-4">
      <button onClick={() => onUpdate(idea)} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm">Edit</button>
      <button onClick={() => onDelete(idea)} className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm">Delete</button>
    </div>
  </div>
);

const MyIdeas = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true); // Initially true
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updateTarget, setUpdateTarget] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // Only fetch if we have an email
    if (user?.email) {
      fetchMyIdeas();
    } else if (user === null) {
      // If user is explicitly null (logged out), stop loading
      setLoading(false);
    }
  }, [user]); // Re-run when 'user' object changes

  const fetchMyIdeas = async () => {
    try {
      setLoading(true); // Make sure we show loading when starting a fetch
      const res = await axiosSecure.get(`/api/ideas/user/${user.email}`);
      setIdeas(res.data);
    } catch (error) { 
      toast.error("Failed to load ideas.");
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      await axiosSecure.put(`/api/ideas/${updateTarget._id}`, formData);
      setIdeas(prev => prev.map(idea => (idea._id === updateTarget._id ? { ...idea, ...formData } : idea)));
      toast.success("Updated successfully!");
      setUpdateTarget(null);
    } catch { toast.error("Failed to update."); } finally { setUpdating(false); }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axiosSecure.delete(`/api/ideas/${deleteTarget._id}`);
      setIdeas(prev => prev.filter(idea => idea._id !== deleteTarget._id));
      toast.success("Deleted successfully.");
      setDeleteTarget(null);
    } catch { toast.error("Failed to delete."); } finally { setDeleting(false); }
  };

  // Prevent rendering main UI until loading is done
  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Ideas</h1>
        {ideas.length === 0 ? (
           <p className="text-gray-500">You haven't shared any ideas yet.</p>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea, i) => (
              <IdeaRow key={idea._id} idea={idea} index={i} onUpdate={(idea) => { setUpdateTarget(idea); setFormData(idea); }} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>
      {deleteTarget && <DeleteModal idea={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} deleting={deleting} />}
      {updateTarget && <UpdateModal formData={formData} setFormData={setFormData} onClose={() => setUpdateTarget(null)} onSubmit={handleUpdate} updating={updating} />}
    </div>
  );
};
export default MyIdeas;