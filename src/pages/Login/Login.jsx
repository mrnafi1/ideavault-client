import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import {
  HiEye, HiEyeOff, HiMail, HiLockClosed, HiLightBulb,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

const Login = () => {
  const { loginUser, googleLogin, user } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/";

  const [formData, setFormData]       = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);

  useEffect(() => {
    document.title = "Login – IdeaVault";
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const saveToken = async (email) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/jwt`,
        { email }
      );
      localStorage.setItem("ideavault-token", res.data.token);
    } catch {
      // silent — app still works without token for public pages
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await loginUser(formData.email, formData.password);
      await saveToken(result.user.email);
      toast.success(`Welcome back, ${result.user.displayName || "there"}! 👋`);
      navigate(from, { replace: true });
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
      navigate(from, { replace: true });
    } catch {
      toast.error("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFirebaseError = (code) => {
    const errors = {
      "auth/user-not-found":    "No account found with this email.",
      "auth/wrong-password":    "Incorrect password. Please try again.",
      "auth/invalid-email":     "Invalid email address.",
      "auth/too-many-requests": "Too many attempts. Please try later.",
      "auth/invalid-credential":"Invalid email or password.",
    };
    return errors[code] || "Login failed. Please try again.";
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">

      {/* ── Left panel ─────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-800 relative overflow-hidden flex-col justify-between p-12">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/3" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <HiLightBulb size={22} className="text-white" />
          </div>
          <span className="text-2xl font-heading font-bold text-white">IdeaVault</span>
        </Link>

        {/* Center content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-heading font-bold text-white leading-tight mb-4">
            Where Ideas<br />
            <span className="text-yellow-300">Come to Life</span>
          </h2>
          <p className="text-primary-200 text-lg leading-relaxed max-w-sm">
            Join thousands of innovators sharing, discovering, and validating
            startup ideas with a global community.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mt-10">
            {[
              { value: "5K+",  label: "Ideas Shared"  },
              { value: "12K+", label: "Innovators"    },
              { value: "30+",  label: "Categories"    },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-heading font-bold text-white">{s.value}</div>
                <div className="text-primary-300 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/10 backdrop-blur rounded-2xl p-5">
          <p className="text-white text-sm leading-relaxed italic">
            "IdeaVault helped me validate my SaaS idea before I wrote a single
            line of code. The community feedback was invaluable."
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-sm font-bold text-yellow-900">
              A
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Alex Rahman</p>
              <p className="text-primary-300 text-xs">SaaS Founder</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ────────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
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
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-8">
            Sign in to continue to IdeaVault
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
            <span className="text-xs text-gray-400 font-medium">OR SIGN IN WITH EMAIL</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <HiMail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <HiLockClosed size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="input-field pl-10 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPassword ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
