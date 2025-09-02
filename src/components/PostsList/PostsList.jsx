import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_IMAGE = "/istockphoto-1337144146-612x612.jpg";

export default function PostsList() {
  const token = localStorage.getItem("token");

  const { data: posts, isLoading, isError } = useQuery(["posts", "all"], async () => {
    const { data } = await axios.get("https://linked-posts.routemisr.com/posts", {
      headers: { token },
    });

    // ترتيب من الأحدث للأقدم
    return data.posts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  });

  if (isLoading) return <p>⏳ Loading posts...</p>;
  if (isError) return <p>❌ Failed to load posts</p>;

  return (
    <div className="space-y-4">
      {posts?.map((post) => (
        <div
          key={post._id}
          className="bg-white shadow-md rounded-2xl p-4 border border-[#167D56]/30"
        >
          <div className="flex items-start gap-3">
            <img
              src={post.user?.photo || DEFAULT_IMAGE}
              alt={post.user?.name || "User"}
              className="w-12 h-12 rounded-full object-cover border border-[#167D56]/40"
            />
            <div className="flex-1">
              <p className="font-medium text-sm">{post.user?.name || "Unknown User"}</p>
              <p className="text-gray-700 text-sm mt-1">{post.body}</p>
              {post.image && (
                <img
                  src={post.image}
                  alt="post"
                  className="w-full rounded-xl mt-2 border border-[#167D56]/30"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
