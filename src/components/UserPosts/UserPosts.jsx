import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../api/axios";
import PostCard from "../Post/Post";
import { jwtDecode } from "jwt-decode";

export default function UserPosts() {
  const token = localStorage.getItem("userToken");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.user || decoded.userId;
    } catch {}
  }

  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ["userPosts", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data: userPostsData } = await api.get(
        `/users/${userId}/posts?limit=50`
      );
      const userPosts = userPostsData.posts || [];

      const { data: allPostsData } = await api.get(`/posts`);
      const allPosts = allPostsData.posts || [];

      const commentsRequests = allPosts.map((post) =>
        api.get(`/posts/${post._id}/comments`)
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
      uniquePosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return uniquePosts;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: 0,
  });

  if (isLoading) return <p className="text-center mt-10">Loading related posts...</p>;
  if (isError) return <p className="text-center mt-10">Failed to load related posts</p>;

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
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
