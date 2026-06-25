import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const useDemoAccount = () => {
    setEmail("demo@aiopscopilot.com");
    setPassword("demo@aiopscopilot.com");
  };

  const handleLogin = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  setLoading(true);
  setError("");

  try {
    const response = await login({
      email,
      password,
    });

    console.log("Login Response:", response);

    const authData = response.data;

    localStorage.setItem(
      "accessToken",
      authData.accessToken
    );

    localStorage.setItem(
      "refreshToken",
      authData.refreshToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(authData.user)
    );

    navigate("/dashboard");
  } catch (err: any) {
    console.error("Login Error:", err);

    setError(
      err?.response?.data?.message ||
      err?.message ||
      "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-black text-white">

      <div className="min-h-screen flex">

        {/* LEFT SECTION */}

        <div className="hidden lg:flex flex-1 border-r border-zinc-900 px-14 py-12 items-center">

          <div className="max-w-xl">

            <div className="text-sm tracking-[0.35em] uppercase text-zinc-600">
              AI OPERATIONS COPILOT
            </div>

            <h1 className="mt-4 text-[4rem] font-bold leading-[1.05]">
              Operational
              <br />
              Intelligence
              <br />
              Platform
            </h1>

            <p className="mt-6 text-zinc-400 text-lg leading-relaxed">
              Enterprise AI assistant for operational
              knowledge, incident analysis and
              infrastructure intelligence.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="border border-zinc-900 rounded-2xl p-5">
                <div className="text-3xl font-bold">
                  72x
                </div>

                <div className="mt-2 text-sm text-zinc-500">
                  RAG Latency Reduction
                </div>
              </div>

              <div className="border border-zinc-900 rounded-2xl p-5">
                <div className="text-3xl font-bold">
                  CI/CD
                </div>

                <div className="mt-2 text-sm text-zinc-500">
                  GitHub Actions Pipeline
                </div>
              </div>

              <div className="border border-zinc-900 rounded-2xl p-5">
                <div className="text-3xl font-bold">
                  BullMQ
                </div>

                <div className="mt-2 text-sm text-zinc-500">
                  Async Inference Queue
                </div>
              </div>

              <div className="border border-zinc-900 rounded-2xl p-5">
                <div className="text-3xl font-bold">
                  RBAC
                </div>

                <div className="mt-2 text-sm text-zinc-500">
                  Tenant Isolation
                </div>
              </div>

            </div>

            <div className="mt-8 border border-zinc-900 rounded-2xl p-5">

              <div className="text-zinc-500 text-sm mb-4">
                Core Platform Capabilities
              </div>

              <div className="grid grid-cols-2 gap-y-3 text-zinc-300">

                <div>✓ Semantic Search</div>
                <div>✓ Redis Caching</div>

                <div>✓ AI Incident Analysis</div>
                <div>✓ BullMQ Processing</div>

                <div>✓ Multi-Tenant RBAC</div>
                <div>✓ CI/CD Automation</div>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="flex-1 flex items-start justify-center px-8 py-12">

          <div className="w-full max-w-md">

            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8">

              <div className="mb-8">

                <div className="uppercase tracking-[0.25em] text-sm text-zinc-600">
                  Sign In
                </div>

                <h2 className="mt-3 text-4xl font-bold">
                  Welcome Back
                </h2>

                <p className="mt-3 text-zinc-500">
                  Access your operational workspace.
                </p>

              </div>

              {error && (
                <div className="mb-5 border border-red-900 bg-red-950/30 rounded-xl p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                <div>

                  <label className="block text-sm text-zinc-500 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="john@company.com"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-white"
                  />

                </div>

                <div>

                  <label className="block text-sm text-zinc-500 mb-2">
                    Password
                  </label>

                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="••••••••"
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-white"
                  />

                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-zinc-200 transition"
                >
                  {loading
                    ? "Signing In..."
                    : "Sign In"}
                </button>

              </form>

              <div className="my-6 border-t border-zinc-900"></div>

              <div className="border border-zinc-900 rounded-xl p-4">

                <div className="font-medium">
                  Quick Demo Access
                </div>

                <div className="mt-2 text-sm text-zinc-500">
                  Use a pre-configured account to
                  explore the platform.
                </div>

                <button
                  onClick={useDemoAccount}
                  className="mt-4 w-full border border-zinc-800 rounded-xl py-2 hover:bg-zinc-900 transition"
                >
                  Use Demo Credentials
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}