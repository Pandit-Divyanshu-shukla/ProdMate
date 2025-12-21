import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Registration successful! Please login.");

      // Redirect to login after short delay
      setTimeout(() => {
        navigate("/");
      }, 500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Register
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-sm mb-3">
            {success}
          </p>
        )}

        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border mb-3 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Register
        </button>

        <p className="text-sm text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
