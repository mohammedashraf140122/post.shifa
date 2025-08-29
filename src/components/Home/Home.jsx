import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../Post/Post";


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("userToken"); // التوكن من اللوكال ستورج
        const response = await axios.get(
          "https://linked-posts.routemisr.com/posts?limit=1000",
          {
            headers: {
              token: ` ${token}`, // الزم التوكن
            },
          }
        );
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading posts...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      ) : (
        <p className="text-center text-slate-500">No posts available</p>
      )}
    </div>
  );
}
