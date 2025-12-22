import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import signPage from "../assets/signup.png";
import googleIcon from "../assets/goggle.png";
import appleIcon from "../assets/apple.png";
import facebookIcon from "../assets/facebook.png";

const LogIn = () => {
  const navigate = useNavigate(); // React Router hook
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Handle traditional login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const res = await fetch("http://127.0.0.1:8000/api/users/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email, // Django expects username
          password: password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Login failed");
      }

      const data = await res.json();
      // Store JWT tokens in localStorage
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);

      // Redirect to dashboard (change path if needed)
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSocialSignup = (provider) => {
    console.log(`Sign up with ${provider}`);
  };
  return (
    <div className="min h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-xl overflow-hidden flex">
        {/* Left panel */}
        <div className="hidden md:flex md:w-1/2 bg-linear-to-br from-blue-900 to-blue-950 items-center justify-center p-12">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-white mb-4 ">ClientX</h2>
            <p className="text-blue-100 text-md mb-8 max-w-md ">
              Streamline your workflow. Manage clients, track tasks, and grow
              your business effortlessly.
            </p>
            <div className="mt-8 flex justify-center">
              <img src={signPage} alt="Facebook" width={300} height={200} />
            </div>
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

          <form className="space-y-4 mt-10" onSubmit={handleLogin}>
            <div className="space-y-4 mt-10">
              <input
                type="email"
                name="email"
                value={email}
                placeholder="Email Address"
                className="w-full px-6 py-4 bg-blue-50 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm required"
                onChange={(e) => setEmail(e.target.value)}
              ></input>

              <input
                type="password"
                name="password"
                value={password}
                placeholder="Password"
                className="w-full px-6 py-4 bg-blue-50 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm required"
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>

            <div className="flex items-center justify-between text-sm px-2 mt-4 mb-4">
              <label className="flex items-center ">
                <input type="checkbox" className="mr-2 cursor-pointer" />
                <span className="text-gray-600">Remember me</span>
              </label>

              <a href="#" className="text-gray-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button className="w-full py-4 bg-gray-800 font-smibold rounded-xl hover:bg-gray-900 tansition-colors text-white cursor-pointer">
              Log In
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
