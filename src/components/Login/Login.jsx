import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { Link } from "react-router-dom";

// ✅ Zod Validation Schema
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[@$!%*?&]/, "Must contain at least one special character"),
});

export default function Login() {
  const { saveToken } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // success / error
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  // ✅ Submit Handler
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "https://linked-posts.routemisr.com/users/signin",
        data
      );

      setMessage("✅ Login successful!");
      setType("success");

      const token = response.data.token;
      saveToken(token);
      localStorage.setItem("userToken", token);

      setTimeout(() => {
        navigate("/home");
      }, 2000);

    } catch (error) {
      const errMsg = error.response?.data?.error || "Something went wrong!";
      setMessage("❌ " + errMsg);
      setType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2E9] via-white to-[#F5F5F5] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* رسالة النجاح/الفشل */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium border ${
              type === "error"
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-green-100 text-green-700 border-green-300"
            }`}
          >
            {message}
          </div>
        )}

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-black/5 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2F7C57] text-center">
            Welcome Back
          </h1>
          <p className="text-center text-sm text-slate-500 mt-1">
            Please login to continue
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#2F7C57] focus:ring-[#2F7C57] shadow-sm px-3 py-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#2F7C57] focus:ring-[#2F7C57] shadow-sm px-3 py-2"
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* زرار Login */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F7C57] text-white font-medium py-2.5 px-4 shadow hover:bg-[#256748] active:bg-[#1b4d35]"
            >
              Login
            </button>
            <h3 className="text-center mt-4">
              Don't have an account?{" "}
              <Link className="text-[#2F7C57] hover:text-[#42bd81] font-semibold" to="/register">
                Sign up
              </Link>
            </h3>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          Created by Mohammed Ashraf
        </p>
      </div>
    </div>
  );
}
