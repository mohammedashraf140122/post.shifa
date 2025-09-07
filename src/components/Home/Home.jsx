import React, { useState } from "react";
import api from "../../api/axios";
import { useQuery } from "@tanstack/react-query";
import PostCard from "../Post/Post";
import CreatePost from "../CreatePost/CreatePost";
import PostsTabs from "./../PostsTabs/PostsTabs";
import UserPosts from "./../UserPosts/UserPosts";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all"); // all | user

  const token = localStorage.getItem("userToken");
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data } = await api.get(
        "https://linked-posts.routemisr.com/posts",
        { headers: { token } }
      );
      return (data.posts || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    enabled: activeTab === "all",
  });

  if (isLoading && activeTab === "all") {
    return <p className="text-center mt-10">Loading posts...</p>;
  }
  if (isError && activeTab === "all") {
    return <p className="text-center mt-10">Failed to load posts</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* ✅ إنشاء بوست */}
      <CreatePost />

      {/* ✅ Tabs فوق البوستات */}
      <PostsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ✅ عرض حسب التاب */}
      {activeTab === "all" ? (
        posts && posts.length > 0 ? (
          posts
            .filter((p) => p && p._id)
            .map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-center text-slate-500">No posts available</p>
        )
      ) : (
        <UserPosts />
      )}
    </div>
  );
}
