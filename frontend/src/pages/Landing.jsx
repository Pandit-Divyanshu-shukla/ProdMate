import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      
      <h1 className="text-4xl font-bold mb-4 text-center">
        ProdMate
      </h1>

      <p className="text-gray-600 text-center max-w-xl mb-6">
        ProdMate helps you manage your daily routines, track task completion,
        and improve productivity using smart insights.
      </p>

      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="border border-blue-600 text-blue-600 px-6 py-2 rounded"
        >
          Login
        </Link>
      </div>

    </div>
  );
}

export default Landing;
