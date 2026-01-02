import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signPage from "../assets/signup.png";
import googleIcon from "../assets/goggle.png";
import appleIcon from "../assets/apple.png";
import facebookIcon from "../assets/facebook.png";

const LogIn = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // backend expects "username"
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Call Django JWT login API
      const loginRes = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        throw new Error(loginData.detail || "Invalid credentials");
      }

      // 2️⃣ Save tokens
      localStorage.setItem("accessToken", loginData.access);
      localStorage.setItem("refreshToken", loginData.refresh);

      // 3️⃣ Redirect based on role
      const user = loginData.user;

      if (user.is_superuser) {
        window.location.href = "/admin"; // superuser → Django admin
      } else if (user.role === "manager") {
        navigate("/manager"); // manager → manager page
      } else {
        navigate("/employee"); // normal employee → employee page
      }
    } catch (err) {
      setError(err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Sign up with ${provider}`);
    alert("Social login not implemented yet");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-900 to-blue-950 items-center justify-center p-12">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-white mb-4">ClientX</h2>
            <p className="text-blue-100 text-md mb-8 max-w-md mx-auto">
              Streamline your workflow. Manage clients, track tasks, and grow
              your business effortlessly.
            </p>
            <img
              src={signPage}
              alt="Illustration"
              className="mx-auto mt-8"
              width={300}
              height={200}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 p-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            LOG IN
          </h1>

          {error && (
            <div className="mb-4 text-red-500 font-medium text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-6 py-4 bg-blue-50 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-6 py-4 bg-blue-50 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2 cursor-pointer" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-gray-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-800 font-semibold rounded-xl hover:bg-gray-900 text-white cursor-pointer disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm mb-4 text-gray-600">or continue with</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleSocialSignup("Google")}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                aria-label="Sign up with Google"
              >
                <img src={googleIcon} alt="Google" width={35} height={35} />
              </button>
              <button
                onClick={() => handleSocialSignup("Apple")}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                aria-label="Sign up with Apple"
              >
                <img src={appleIcon} alt="Apple" width={35} height={35} />
              </button>
              <button
                onClick={() => handleSocialSignup("Facebook")}
                className="hover:opacity-80 transition-opacity cursor-pointer"
                aria-label="Sign up with Facebook"
              >
                <img src={facebookIcon} alt="Facebook" width={35} height={35} />
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an Account?{" "}
            <a href="#" className="text-green-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
