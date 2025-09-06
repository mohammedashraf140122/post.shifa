import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../Post/Post";
import CreatePost from "../CreatePost/CreatePost";
import PostsTabs from "./../PostsTabs/PostsTabs";
import UserPosts from "./../UserPosts/UserPosts";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // all | user

  useEffect(() => {
    if (activeTab === "all") {
      const fetchPosts = async () => {
        try {
          const token = localStorage.getItem("userToken");
          const response = await axios.get(
            "https://linked-posts.routemisr.com/posts",
            { headers: { token } }
          );
          setPosts(response.data.posts || []);
        } catch (error) {
          console.error("Error fetching posts:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchPosts();
    }
  }, [activeTab]);

  if (loading && activeTab === "all") {
    return <p className="text-center mt-10">Loading posts...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* ✅ إنشاء بوست */}
      <CreatePost />

      {/* ✅ Tabs فوق البوستات */}
      <PostsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ✅ عرض حسب التاب */}
      {activeTab === "all" ? (
        posts.length > 0 ? (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        ) : (
          <p className="text-center text-slate-500">No posts available</p>
        )
      ) : (
        <UserPosts />
      )}
    </div>
  );
}
