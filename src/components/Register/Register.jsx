import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// ✅ Zod Validation Schema
const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
    rePassword: z.string(),
    dateOfBirth: z.string().nonempty("Date of birth is required"),
    gender: z.enum(["male", "female"], {
      required_error: "Gender is required",
    }),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords don't match",
    path: ["rePassword"],
  });

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    resetField,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [message, setMessage] = useState("");
  const [type, setType] = useState(""); // "success" or "error"

  // ✅ Submit Handler
  const onSubmit = (data) => {
    axios
      .post("https://linked-posts.routemisr.com/users/signup", data)
      .then(function (response) {
        console.log("✅ Registration successful:", response.data);
        setMessage("✅ Registration successful!");
        setType("success");

        // clear fields
        resetField("name");
        resetField("email");
        resetField("password");
        resetField("rePassword");
        resetField("dateOfBirth");
        resetField("gender");

        setTimeout(() => {
          navigate("/login"); 
        }, 2000);
      })
      .catch(function (error) {
        const errMsg = error.response?.data?.error || "Something went wrong!";
        setMessage("❌ " + errMsg);
        setType("error");
        console.error("❌ Registration failed:", errMsg);
      });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#E0F2E9] via-white to-[#F5F5F5] flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          <div>
            {/* الرسالة تظهر فوق الفورم */}
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
          </div>
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-black/5 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2F7C57] text-center">
              Create your account
            </h1>
            <p className="text-center text-sm text-slate-500 mt-1">
              Please fill the fields below to continue
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Name"
                  className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#2F7C57] focus:ring-[#2F7C57] shadow-sm px-3 py-2"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
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
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Confirm password
                </label>
                <input
                  {...register("rePassword")}
                  type="password"
                  placeholder="Confirm password"
                  className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#2F7C57] focus:ring-[#2F7C57] shadow-sm px-3 py-2"
                />
                {errors.rePassword && (
                  <p className="text-red-500 text-sm">
                    {errors.rePassword.message}
                  </p>
                )}
              </div>
              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Date of birth
                </label>
                <input
                  {...register("dateOfBirth")}
                  type="date"
                  className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#2F7C57] focus:ring-[#2F7C57] shadow-sm px-3 py-2"
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#2F7C57] focus:ring-[#2F7C57] shadow-sm px-3 py-2"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.gender.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2F7C57] text-white font-medium py-2.5 px-4 shadow hover:bg-[#256748] active:bg-[#1b4d35]"
              >
                Register
              </button>
              <h3 className="text-center mt-4">
                Already have an account?{" "}
                <Link className="text-[#2F7C57] font-semibold hover:text-[#42bd81]"  to="/Login">
                  Login
                </Link>
              </h3>
            </form>
          </div>
          <p className="text-center text-xs text-slate-500 mt-4">
            Created by Mohammed Ashraf
          </p>
        </div>
      </div>
    </>
  );
}
