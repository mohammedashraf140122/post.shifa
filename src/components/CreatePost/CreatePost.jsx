import React, { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_IMAGE = "/istockphoto-1337144146-612x612.jpg";

export default function CreatePost() {
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const token = localStorage.getItem("userToken");

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!body.trim() && !image) return;

    const formData = new FormData();
    formData.append("body", body);
    if (image) formData.append("image", image); // تأكد اسم الحقل "image" صحيح حسب السيرفر

    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/posts",
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      // استخدام البوست اللي بيرجع من السيرفر مباشرة
      const newPost = data.post;

      // إضافة البوست مباشرة للـ cache
      queryClient.setQueryData(["posts", "all"], (oldPosts) => {
        if (!oldPosts) return { data: [newPost] };
        return {
          ...oldPosts,
          data: [newPost, ...oldPosts.data],
        };
      });

      setBody("");
      setImage(null);

      toast.success("✅ Post created successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create post", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleCreatePost}
        className="bg-white shadow-md rounded-2xl p-4 mb-6 border border-[#167D56]/30"
      >
        <div className="flex items-start gap-3">
          <img
            src={DEFAULT_IMAGE}
            alt="me"
            className="w-12 h-12 rounded-full object-cover border border-[#167D56]/40"
          />
          <div className="flex-1">
            <textarea
              placeholder="What's on your mind?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border border-[#167D56]/30 rounded-xl px-3 py-2 text-sm mb-3 resize-none focus:outline-none focus:ring-1 focus:ring-[#167D56]"
            />
            {image && (
              <div className="mb-3">
                <img
                  src={URL.createObjectURL(image)}
                  alt="preview"
                  className="w-full rounded-xl border border-[#167D56]/30"
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <label className="cursor-pointer text-sm text-[#167D56] font-medium hover:underline">
                📷 Add Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="hidden"
                />
              </label>
              <button
                type="submit"
                disabled={loading || (!body.trim() && !image)}
                className="bg-[#167D56] text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      ></path>
                    </svg>
                    Posting...
                  </span>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
