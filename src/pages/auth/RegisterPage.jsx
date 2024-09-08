import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../utils/user";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await register(email, password, role);
      if (res.success) {
        // Handle successful login, e.g., navigate to the dashboard
        navigate("/dashboard");
      } else {
        // Handle errors and update state
        setError(res.message);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen">
      <section className="flex-1 md:flex hidden items-center justify-center">
        <img src="/logo.png" alt="logo" className="w-52" />
      </section>
      <section className="md:w-[50rem] w-full flex justify-center items-center bg-red-950">
        <form className="flex flex-col gap-4 w-[300px]" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold mb-4 text-white">Register</h1>
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
          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-gray-200">
              I'm a ...
            </label>
            <select
              name="role"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-2 rounded-lg border-2 border-black/50"
            >
              <option value="">Select role</option>
              <option value="STUDENT">Student</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-white text-red-950 p-2 rounded-lg"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="flex gap-2 text-white">
            <p>Already have an account?</p>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
          </div>
          {error && <p className="text-red-400 mt-2">{error}</p>}
        </form>
      </section>
    </main>
  );
}
