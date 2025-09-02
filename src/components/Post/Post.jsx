import React, { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DEFAULT_IMAGE = "/istockphoto-1337144146-612x612.jpg";

export default function PostCard({ post, showAllComments = false }) {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  const commentsToShow = showAllComments ? post.comments || [] : (post.comments || []).slice(-1);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://linked-posts.routemisr.com/comments",
        { content: newComment, post: post._id },
        { headers: { token, "Content-Type": "application/json" } }
      );

      setNewComment("");

      queryClient.setQueryData(["posts", "all"], (oldPosts) => {
        if (!oldPosts) return oldPosts;
        return oldPosts.map((p) => (p._id === post._id ? { ...p, comments: [...(p.comments || []), data.comment] } : p));
      });

      queryClient.invalidateQueries(["posts", "all"]);
      toast.success("💬 Comment added!", { position: "top-right", autoClose: 3000 });
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add comment", { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 mb-6 border border-[#167D56]/30">
      <div className="flex items-center gap-3 mb-4">
        <img src={post.user?.photo || DEFAULT_IMAGE} alt={post.user?.name || "User"} className="w-12 h-12 rounded-full object-cover border-2 border-[#167D56]" />
        <div>
          <p className="font-semibold text-[#167D56]">{post.user?.name || "Unknown User"}</p>
          <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-3 cursor-pointer" onClick={() => navigate(`/post/${post._id}`)}>
        {post.body && <p className="text-gray-700 mb-2">{post.body}</p>}
        {post.image && <img src={post.image} alt="post" className="w-full h-auto rounded-lg border border-[#167D56]/20" />}
      </div>

      <div className="flex justify-around text-sm border-t border-b border-[#167D56]/30 py-2 mb-3 text-[#167D56]">
        <button className="flex items-center gap-1 hover:text-green-700 cursor-pointer" onClick={() => navigate(`/post/${post._id}`)}>💬 Comment</button>
        <button className="flex items-center gap-1 hover:text-green-700 cursor-pointer">↗ Share</button>
        <button className="flex items-center gap-1 hover:text-green-700 cursor-pointer">🔖 Save</button>
      </div>

      <div className="flex items-center gap-2 mt-3">
        <input type="text" placeholder="Write a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} className="flex-1 border border-[#167D56]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#167D56]" />
        <button type="button" onClick={handleAddComment} disabled={loading || !newComment.trim()} className="bg-[#167D56] text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-80 flex items-center justify-center">
          {loading ? <span className="animate-spin h-5 w-5 border-2 border-white rounded-full"></span> : "Send"}
        </button>
      </div>

      <div className="mt-4">
        {commentsToShow.length > 0 ? commentsToShow.map((comment) => (
          <div key={comment._id} className="flex items-start gap-3 mb-3 bg-gray-50 border border-[#167D56]/20 p-3 rounded-lg">
            <img src={comment.commentCreator?.photo || DEFAULT_IMAGE} alt={comment.commentCreator?.name || "User"} className="w-10 h-10 rounded-full object-cover border border-[#167D56]/50" />
            <div>
              <p className="text-sm font-semibold text-[#167D56]">{comment.commentCreator?.name || "Unknown"}</p>
              <p className="text-sm text-gray-700">{comment.content}</p>
              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
          </div>
        )) : <p className="text-sm text-gray-500">{showAllComments ? "No comments yet" : "No recent comment"}</p>}
      </div>
    </div>
  );
}
