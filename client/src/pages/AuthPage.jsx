import { motion } from "framer-motion";
import { useState } from "react";
import { login, signup } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { ensureSocket } from "../socket";



export default function AuthPage({ mode }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const data = await login(username, password);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        await signup(username, password);
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    }
    
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card p-8 rounded-2xl shadow-xl"
      >
        <h1 className="text-2xl font-bold text-white mb-2">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>

        <p className="text-slate-400 mb-6">
          Real-time collaborative code editor
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg bg-bg text-white border border-slate-700 focus:border-accent outline-none"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-bg text-white border border-slate-700 focus:border-accent outline-none"
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            className="w-full bg-accent py-3 rounded-lg text-white font-semibold hover:opacity-90 transition"
          >
            {mode === "login" ? "Login" : "Sign Up"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
