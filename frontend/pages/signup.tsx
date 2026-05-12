import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff, BookOpen } from "lucide-react";

export default function SignupPage() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, username, password);
      toast.success("Account created!");
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg || "Signup failed");
      } else {
        toast.error(typeof detail === "string" ? detail : "Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-accent flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-paper rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-accent" />
          </div>
          <span className="font-display font-bold text-paper text-lg">KnowledgeHub</span>
        </div>
        <div>
          <h2 className="font-display font-bold text-paper text-5xl leading-tight mb-6">
            Your second brain, organized.
          </h2>
          <p className="text-paper/70 font-body text-lg leading-relaxed">
            Save articles, videos, and links. Tag them for instant retrieval. Search across your entire collection.
          </p>
        </div>
        <div className="flex gap-3">
          {["#research", "#design", "#dev", "#learning"].map((tag) => (
            <span key={tag} className="bg-paper/20 text-paper text-xs font-mono px-3 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8 lg:hidden">
              <div className="w-8 h-8 bg-ink rounded-lg flex items-center justify-center">
                <BookOpen size={16} className="text-paper" />
              </div>
              <span className="font-display font-bold text-ink text-lg">KnowledgeHub</span>
            </div>
            <h1 className="font-display font-bold text-3xl text-ink mb-2">Create account</h1>
            <p className="text-muted text-sm">Start building your knowledge library today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-display font-semibold text-ink uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input"
              />
            </div>
            <div>
              <label className="block text-xs font-display font-semibold text-ink uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="your_username"
                required
                minLength={3}
                className="input"
              />
            </div>
            <div>
              <label className="block text-xs font-display font-semibold text-ink uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
                  className="input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center flex items-center gap-2 mt-6">
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-paper/30 border-t-paper rounded-full animate-spin" />
              ) : null}
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
