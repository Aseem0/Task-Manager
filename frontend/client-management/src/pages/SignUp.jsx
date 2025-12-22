import googleIcon from "../assets/goggle.png";
import appleIcon from "../assets/apple.png";
import facebookIcon from "../assets/facebook.png";
import signPage from "../assets/signup.png";

const SignUp = () => {
  const handleSocialSignup = (provider) => {
    console.log(`Sign up with ${provider}`);
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden flex">
        <div className="w-full md:w-1/2 p-12 bg-gray-50">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
            SIGN UP
          </h1>
          <div className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-6 py-4 bg-blue-50 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            ></input>

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full px-6 py-4 bg-blue-50 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            ></input>

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-6 py-4 bg-blue-50 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            ></input>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full px-6 py-4 bg-blue-50 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            ></input>

            <button className="w-full py-4 bg-gray-800 font-smibold rounded-xl hover:bg-gray-900 tansition-colors text-white cursor-pointer">
              Sign Up
            </button>
          </div>
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
            Already have an account?{" "}
            <a href="#" className="text-green-500 hover:underline">
              Log in
            </a>
          </p>
        </div>

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
      </div>
    </div>
  );
};

export default SignUp;
