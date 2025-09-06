import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../Post/Post";
import { jwtDecode } from "jwt-decode";

export default function UserPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("userToken");
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.user || decoded.userId;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  useEffect(() => {
    if (!userId) return;

    const fetchUserRelatedPosts = async () => {
      try {
        const { data: userPostsData } = await axios.get(
          `https://linked-posts.routemisr.com/users/${userId}/posts?limit=50`,
          { headers: { token } }
        );
        const userPosts = userPostsData.posts || [];

        const { data: allPostsData } = await axios.get(
          "https://linked-posts.routemisr.com/posts",
          { headers: { token } }
        );
        const allPosts = allPostsData.posts || [];

        const commentsRequests = allPosts.map((post) =>
          axios.get(
            `https://linked-posts.routemisr.com/posts/${post._id}/comments`,
            { headers: { token } }
          )
        );
        const commentsResponses = await Promise.all(commentsRequests);

        const commentedPosts = allPosts.filter((post, index) =>
          commentsResponses[index].data.comments?.some(
            (c) => c.commentCreator?._id === userId
          )
        );

        const relatedPosts = [...userPosts, ...commentedPosts];

        const uniquePosts = Array.from(
          new Map(relatedPosts.map((p) => [p._id, p])).values()
        );

        uniquePosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPosts(uniquePosts);
      } catch (err) {
        console.error("Error fetching user related posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRelatedPosts();
  }, [userId, token]);

  if (loading) return <p className="text-center mt-10">Loading related posts...</p>;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onLocalUpdate={(updatedPost) =>
              setPosts((prev) =>
                prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
              )
            }
            onLocalDelete={(deletedId) =>
              setPosts((prev) => prev.filter((p) => p._id !== deletedId))
            }
          />
        ))
      ) : (
        <p className="text-center text-gray-500">
          No posts found for this user
        </p>
      )}
    </div>
  );
}
