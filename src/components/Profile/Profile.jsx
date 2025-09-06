import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff, Upload } from "lucide-react";

// ✅ Schema لتغيير الباسورد
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[@$!%*?&]/, "Must contain at least one special character"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[@$!%*?&]/, "Must contain at least one special character"),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
  });

export default function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [uploading, setUploading] = useState(false);

  const [preview, setPreview] = useState(null); // معاينة الصورة
  const [selectedFile, setSelectedFile] = useState(null); // الملف اللي اخترناه

  const token = localStorage.getItem("userToken");

  // ✅ تغيير الباسورد
  const onSubmit = async (data) => {
    try {
      await axios.patch(
        "https://linked-posts.routemisr.com/users/change-password",
        {
          password: data.password,
          newPassword: data.newPassword,
        },
        { headers: { token } }
      );
      setMessage("✅ Password updated successfully");
      setType("success");
      reset();
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Failed to update password");
      setType("error");
    }
  };

  // ✅ اختيار صورة وعرض المعاينة
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setMessage("❌ File too large (max 4MB)");
      setType("error");
      return;
    }
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ تأكيد رفع الصورة
  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("photo", selectedFile);

    try {
      setUploading(true);
      await axios.put(
        "https://linked-posts.routemisr.com/users/upload-photo",
        formData,
        { headers: { token } }
      );
      setMessage("✅ Profile photo updated successfully");
      setType("success");
      setPreview(null);
      setSelectedFile(null);
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Failed to upload photo");
      setType("error");
    } finally {
      setUploading(false);
    }
  };

  // ✅ إلغاء رفع الصورة
  const handleCancelUpload = () => {
    setPreview(null);
    setSelectedFile(null);
    setMessage("🚫 Upload canceled");
    setType("error");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0F2E9] via-white to-[#F5F5F5] flex items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        {message && (
          <div
            className={`p-3 rounded-lg text-sm font-medium border ${
              type === "error"
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-green-100 text-green-700 border-green-300"
            }`}
          >
            {message}
          </div>
        )}

        {/* ✅ رفع صورة */}
        <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
          {!preview ? (
            <label className="cursor-pointer inline-flex items-center gap-2 bg-[#2F7C57] hover:bg-[#256748] text-white px-4 py-2 rounded-xl shadow">
              <Upload size={18} />
              {uploading ? "Uploading..." : "Upload Photo"}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePhotoSelect}
              />
            </label>
          ) : (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto w-32 h-32 object-cover rounded-full border"
              />
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleConfirmUpload}
                  disabled={uploading}
                  className="bg-[#2F7C57] hover:bg-[#256748] text-white px-4 py-2 rounded-xl shadow"
                >
                  {uploading ? "Uploading..." : "Confirm"}
                </button>
                <button
                  onClick={handleCancelUpload}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ✅ تغيير باسورد */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold text-[#2F7C57] mb-4">
            Change Password
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Current password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="Enter current password"
                  className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#2F7C57] focus:ring-[#2F7C57] shadow-sm px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password.message}</p>
              )}
            </div>

            {/* New password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  {...register("newPassword")}
                  placeholder="Enter new password"
                  className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#2F7C57] focus:ring-[#2F7C57] shadow-sm px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm new password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmNewPassword")}
                  placeholder="Confirm new password"
                  className="mt-1 w-full rounded-xl border border-slate-300 focus:border-[#2F7C57] focus:ring-[#2F7C57] shadow-sm px-3 py-2"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmNewPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmNewPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-xl bg-[#2F7C57] text-white font-medium py-2.5 px-4 shadow hover:bg-[#256748] active:bg-[#1b4d35]"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
