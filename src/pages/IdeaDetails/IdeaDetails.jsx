import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import CommentSection from "./components/CommentSection";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  HiArrowLeft,
  HiCalendar,
  HiUser,
  HiTag,
  HiCurrencyDollar,
  HiUserGroup,
  HiLightningBolt,
  HiCheckCircle,
} from "react-icons/hi";

const categoryColors = {
  Tech: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  Health: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  AI: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  Education: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  Finance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  Others: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

const IdeaDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ideaData, setIdeaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Idea Details – IdeaVault";
    fetchIdeaDetails();
  }, [id]);

  const fetchIdeaDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/ideas/${id}`
      );
      setIdeaData(response.data);
      document.title = `${response.data.title} – IdeaVault`;
    } catch (error) {
      console.error("Failed to fetch idea:", error);
      toast.error("Failed to load idea details.");
      navigate("/ideas");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!ideaData) return null;

  const categoryStyle = categoryColors[ideaData.category] || categoryColors["Others"];

  const postedDate = ideaData.createdAt
    ? new Date(ideaData.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back button */}
        <Link
          to="/ideas"
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:gap-3 transition-all mb-6 font-medium"
        >
          <HiArrowLeft size={18} />
          Back to Ideas
        </Link>

        {/* Cover image */}
        {ideaData.imageURL && (
          <div className="rounded-2xl overflow-hidden h-80 mb-8 border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <img
              src={ideaData.imageURL}
              alt={ideaData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Main content card */}
        <div className="card p-8 mb-8">

          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${categoryStyle}`}>
              {ideaData.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <HiCalendar size={15} />
              Posted on {postedDate}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-heading font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            {ideaData.title}
          </h1>

          {/* Short description */}
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            {ideaData.shortDescription}
          </p>

          {/* Author info */}
          <div className="flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-gray-700">
            <img
              src={
                ideaData.authorPhoto ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  ideaData.authorName || "User"
                )}&background=6366f1&color=fff`
              }
              alt={ideaData.authorName}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {ideaData.authorName || "Anonymous"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Idea Creator
              </p>
            </div>
          </div>

          {/* Tags */}
          {ideaData.tags && ideaData.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <HiTag size={16} className="text-gray-400" />
              {ideaData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Detailed description */}
          <div className="mt-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900 dark:text-white mb-4">
              About This Idea
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {ideaData.detailDescription}
            </p>
          </div>
        </div>

        {/* Business details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Target Audience */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                <HiUserGroup size={20} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-heading font-semibold text-gray-900 dark:text-white">
                Target Audience
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {ideaData.targetAudience}
            </p>
          </div>

          {/* Estimated Budget */}
          {ideaData.budget && (
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
                  <HiCurrencyDollar size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-heading font-semibold text-gray-900 dark:text-white">
                  Estimated Budget
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {ideaData.budget}
              </p>
            </div>
          )}
        </div>

        {/* Problem & Solution cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Problem Statement */}
          <div className="card p-6 border-l-4 border-red-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <HiLightningBolt size={20} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="font-heading font-semibold text-gray-900 dark:text-white text-lg">
                Problem Statement
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {ideaData.problemStatement}
            </p>
          </div>

          {/* Proposed Solution */}
          <div className="card p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <HiCheckCircle size={20} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-heading font-semibold text-gray-900 dark:text-white text-lg">
                Proposed Solution
              </h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {ideaData.proposedSolution}
            </p>
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection ideaId={id} />
      </div>
    </div>
  );
};

export default IdeaDetails;