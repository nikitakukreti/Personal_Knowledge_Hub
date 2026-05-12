import { useState, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import toast from "react-hot-toast";
import { Eye, EyeOff, BookOpen } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <BookOpen size={16} className="text-paper" />
          </div>
          <span className="font-display font-bold text-paper text-lg">KnowledgeHub</span>
        </div>
        <div>
          <blockquote className="text-paper/60 font-body text-lg leading-relaxed mb-8">
            "The ability to collect, organize, and retrieve knowledge is the foundation of all intellectual work."
          </blockquote>
          <div className="grid grid-cols-2 gap-4">
            {["Articles", "Videos", "Links", "Research"].map((item) => (
              <div key={item} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="text-paper/40 text-xs font-mono uppercase tracking-widest mb-1">{item}</div>
                <div className="text-paper font-display font-semibold text-2xl">{Math.floor(Math.random() * 90 + 10)}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-paper/30 text-xs font-mono">© 2024 KnowledgeHub</p>
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
            <h1 className="font-display font-bold text-3xl text-ink mb-2">Sign in</h1>
            <p className="text-muted text-sm">Access your personal knowledge library</p>
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
              <label className="block text-xs font-display font-semibold text-ink uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            No account yet?{" "}
            <Link href="/signup" className="text-accent font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
