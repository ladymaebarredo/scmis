import { useState, useTransition } from "react";
import { login } from "../../utils/user";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state

  console.log(loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading to true when login starts
    try {
      const res = await login(email, password);
      if (res.success) {
        // Handle successful login, e.g., navigate to the dashboard
        navigate("/dashboard");
      } else {
        // Handle errors and update state
        setError(res.message);
      }
    } catch (error) {
      // Handle unexpected errors
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false); // Set loading to false after login completes
    }
  };

  return (
    <main className="flex h-screen">
      <section className="flex-1 md:flex items-center justify-center hidden overflow-hidden">
        <img src="/logo.png" alt="logo" className="w-52" />
      </section>
      <section className="md:w-[50rem] w-full flex justify-center items-center bg-red-950">
        <form className="flex flex-col gap-4 w-[300px]" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold mb-4 text-white">Login</h1>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded-lg border-2 border-black/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 rounded-lg border-2 border-black/50"
            />
          </div>
          <button
            type="submit"
            className="bg-white text-red-950 p-2 rounded-lg"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="flex gap-2 text-white">
            <p>Don't have an account?</p>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </div>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </form>
      </section>
    </main>
  );
}
