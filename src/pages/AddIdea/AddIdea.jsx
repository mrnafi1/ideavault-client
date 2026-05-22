import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { HiLightBulb, HiPhotograph, HiTag, HiX, HiPlusCircle } from "react-icons/hi";

const categoryOptions = ["Tech", "Health", "AI", "Education", "Finance", "Others"];

const emptyForm = {
  title: "",
  shortDescription: "",
  detailedDescription: "",
  category: "",
  imageURL: "",
  estimatedBudget: "",
  targetAudience: "",
  problemStatement: "",
  proposedSolution: "",
};

const AddIdea = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(emptyForm);
  const [tagList, setTagList] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Add Idea – IdeaVault";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().replace(",", "");
      if (newTag && !tagList.includes(newTag) && tagList.length < 5) {
        setTagList((prev) => [...prev, newTag]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTagList((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formValues.category) {
      toast.error("Please select a category.");
      return;
    }

    setIsSubmitting(true);
    try {
      const ideaData = {
        ...formValues,
        tags: tagList,
        authorName: user.displayName || "Anonymous",
        authorEmail: user.email,
        authorPhoto: user.photoURL || "",
      };

      await axiosSecure.post("/api/ideas", ideaData);
      toast.success("Your idea has been submitted! 🎉");
      setFormValues(emptyForm);
      setTagList([]);
      navigate("/my-ideas");
    } catch (err) {
      toast.error("Failed to submit idea. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Page header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <HiLightBulb size={22} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
              Submit Your Idea
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 ml-14">
            Share your startup concept with the IdeaVault community and get valuable feedback.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Section 1 — Basic Info */}
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-heading font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
              Basic Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Idea Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="e.g. AI-Powered Mental Health Companion App"
                required
                maxLength={100}
                className="input-field"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {formValues.title.length}/100
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="shortDescription"
                value={formValues.shortDescription}
                onChange={handleChange}
                placeholder="A one or two sentence summary shown on idea cards"
                required
                rows={2}
                maxLength={200}
                className="input-field resize-none"
              />
              <p className="text-xs text-gray-400 mt-1 text-right">
                {formValues.shortDescription.length}/200
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="detailedDescription"
                value={formValues.detailedDescription}
                onChange={handleChange}
                placeholder="Describe your idea fully. How does it work? What makes it unique?"
                required
                rows={5}
                className="input-field resize-none"
              />
            </div>
          </div>

          {/* Section 2 — Category, Tags & Image */}
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-heading font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
              Category & Media
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formValues.category}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select a category</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Tags{" "}
                <span className="text-gray-400 font-normal">(optional — max 5)</span>
              </label>

              {tagList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {tagList.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm px-3 py-1 rounded-full"
                    >
                      <HiTag size={13} />
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <HiX size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={
                  tagList.length >= 5
                    ? "Max 5 tags reached"
                    : "Type a tag and press Enter or comma"
                }
                disabled={tagList.length >= 5}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Press{" "}
                <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">
                  Enter
                </kbd>{" "}
                or{" "}
                <kbd className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">
                  ,
                </kbd>{" "}
                to add a tag
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Cover Image URL{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <HiPhotograph
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="url"
                  name="imageURL"
                  value={formValues.imageURL}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="input-field pl-10"
                />
              </div>

              {formValues.imageURL && (
                <div className="mt-3 rounded-xl overflow-hidden h-40 border border-gray-200 dark:border-gray-700">
                  <img
                    src={formValues.imageURL}
                    alt="cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section 3 — Business Details */}
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-heading font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
              Business Details
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Target Audience <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="targetAudience"
                value={formValues.targetAudience}
                onChange={handleChange}
                placeholder="e.g. College students aged 18–25 dealing with stress"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Estimated Budget{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                name="estimatedBudget"
                value={formValues.estimatedBudget}
                onChange={handleChange}
                placeholder="e.g. $10,000 – $50,000"
                className="input-field"
              />
            </div>
          </div>

          {/* Section 4 — Problem & Solution */}
          <div className="card p-6 space-y-5">
            <h2 className="text-lg font-heading font-semibold text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
              Problem & Solution
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Problem Statement <span className="text-red-500">*</span>
              </label>
              <textarea
                name="problemStatement"
                value={formValues.problemStatement}
                onChange={handleChange}
                placeholder="What problem does this idea solve? Why does this problem exist?"
                required
                rows={4}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Proposed Solution <span className="text-red-500">*</span>
              </label>
              <textarea
                name="proposedSolution"
                value={formValues.proposedSolution}
                onChange={handleChange}
                placeholder="How does your idea solve this problem? What is your approach?"
                required
                rows={4}
                className="input-field resize-none"
              />
            </div>
          </div>

          {/* Submit & Reset */}
          <div className="flex items-center gap-4 pb-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-8 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <HiPlusCircle size={18} />
                  Submit Idea
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormValues(emptyForm);
                setTagList([]);
                toast.success("Form cleared!");
              }}
              className="btn-outline py-3"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIdea;