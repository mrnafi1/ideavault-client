import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  HiEye, HiEyeOff, HiMail, HiLockClosed,
  HiUser, HiPhotograph, HiCheckCircle, HiXCircle, HiLightBulb,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Register = () => {
  const { registerUser, updateUserProfile, googleLogin, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", photoURL: "", password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Register – IdeaVault";
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // Password validation rules
  const rules = {
    minLength: formData.password.length >= 6,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
  };
  const allRulesPass = Object.values(rules).every(Boolean);

  const saveToken = async (email) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/jwt`,
        { email }
      );
      localStorage.setItem("ideavault-token", res.data.token);
    } catch {
      // silent
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!allRulesPass) {
      toast.error("Please fix the password requirements.");
      return;
    }
    setLoading(true);
    try {
      const result = await registerUser(formData.email, formData.password);
      await updateUserProfile(formData.name, formData.photoURL);
      await saveToken(result.user.email);
      toast.success(`Account created! Welcome, ${formData.name}! 🎉`);
      navigate("/");
    } catch (err) {
      toast.error(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await googleLogin();
      await saveToken(result.user.email);
      toast.success(`Welcome, ${result.user.displayName}! 🎉`);
      navigate("/");
    } catch {
      toast.error("Google sign-up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFirebaseError = (code) => {
    const errors = {
      "auth/email-already-in-use": "This email is already registered. Try logging in.",
      "auth/invalid-email": "Invalid email address format.",
      "auth/weak-password": "Password is too weak.",
    };
    return errors[code] || "Registration failed. Please try again.";
  };

  const RuleItem = ({ passed, label }) => (
    <li className="flex items-center gap-2 text-sm">
      {passed
        ? <HiCheckCircle size={16} className="text-green-500 shrink-0" />
        : <HiXCircle size={16} className="text-gray-300 dark:text-gray-600 shrink-0" />}
      <span className={passed ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}>
        {label}
      </span>
    </li>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">

      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-primary-800 to-primary-700 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/3" />

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <HiLightBulb size={22} className="text-white" />
          </div>
          <span className="text-2xl font-heading font-bold text-white">IdeaVault</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl font-heading font-bold text-white leading-tight mb-4">
            Start Your<br />
            <span className="text-yellow-300">Innovation Journey</span>
          </h2>
          <p className="text-primary-200 text-lg leading-relaxed max-w-sm">
            Share your startup ideas, get community validation, and connect
            with like-minded innovators across the globe.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: "🚀", text: "Submit and showcase your startup ideas" },
              { icon: "💬", text: "Get feedback from real innovators" },
              { icon: "📈", text: "Discover trending ideas in your field" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-primary-200 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/10 backdrop-blur rounded-2xl p-5">
          <p className="text-white text-sm leading-relaxed italic">
            "Within a week of posting my idea on IdeaVault, I connected with
            my co-founder. Best decision I ever made."
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center text-sm font-bold text-emerald-900">
              S
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Sara Hossain</p>
              <p className="text-primary-300 text-xs">Co-founder, EduTech BD</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <HiLightBulb size={18} className="text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-primary-600 dark:text-primary-400">
              IdeaVault
            </span>
          </Link>

          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Create your account
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8">
            Join IdeaVault and start sharing your ideas
          </p>

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <FcGoogle size={22} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400 font-medium">OR REGISTER WITH EMAIL</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <HiUser size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} placeholder="John Doe"
                  required className="input-field pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <HiMail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleChange} placeholder="you@example.com"
                  required className="input-field pl-10"
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Photo URL <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <HiPhotograph size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="url" name="photoURL" value={formData.photoURL}
                  onChange={handleChange} placeholder="https://example.com/photo.jpg"
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <HiLockClosed size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" value={formData.password}
                  onChange={handleChange} placeholder="Create a strong password"
                  required className="input-field pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>

              {/* Password rules */}
              {formData.password && (
                <ul className="mt-2.5 space-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <RuleItem passed={rules.minLength} label="At least 6 characters" />
                  <RuleItem passed={rules.hasUppercase} label="At least one uppercase letter (A-Z)" />
                  <RuleItem passed={rules.hasLowercase} label="At least one lowercase letter (a-z)" />
                </ul>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
