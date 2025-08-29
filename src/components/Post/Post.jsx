import React, { useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SinglePost from "../SinglePost/SinglePost";

const DEFAULT_IMAGE = "/istockphoto-1337144146-612x612.jpg";
 
const PostCard = ({ post }) => {
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(post.likes || 0);

  const queryClient = useQueryClient();
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  // mutation لإضافة كومنت
  const addCommentMutation = useMutation({
    mutationFn: async (content) => {
      const res = await axios.post(
        "https://linked-posts.routemisr.com/comments",
        {
          content,
          post: post._id,
        },
        {
          headers: {
            token: token,
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["post", post._id]);
      setNewComment("");
    },
  });

  const sortedComments = [...(post.comments || [])].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  const latestTwo = sortedComments.slice(-2);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addCommentMutation.mutate(newComment);
  };
  

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-5">
      {/* بيانات صاحب البوست */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={
            post.user?.photo && !post.user.photo.includes("undefined")
              ? post.user.photo
              : DEFAULT_IMAGE
          }
          alt={post.user?.name || "User"}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold">{post.user?.name || "Unknown User"}</p>
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {/* نص البوست وصورة */}
      <div
        className="mb-3 cursor-pointer"
        onClick={() => navigate(`/post/${post._id}`)}
      >
        {post.body && <p className="text-gray-700 mb-2">{post.body}</p>}
        {post.image && !post.image.includes("undefined") && (
          <img
            src={post.image}
            alt="post"
            className="w-full h-auto rounded-lg"
          />
        )}
      </div>

      {/* الأكشنز */}
      <div className="flex justify-between text-gray-600 text-sm border-t border-b py-2 mb-3">
        <button
          onClick={() => setLikes((prev) => prev + 1)}
          className="flex items-center gap-1 hover:text-blue-600"
        >
          👍 Like {likes}
        </button>
        <button
          className="flex items-center gap-1 hover:text-blue-600"
          onClick={() => navigate(`/post/${post._id}`)}
        >
          💬 Comment
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600">
          ↗ Share
        </button>
        <button className="flex items-center gap-1 hover:text-blue-600">
          🔖 Save
        </button>
      </div>

      {/* الكومنتات (آخر اتنين) */}
      <div className="mt-4">
        {latestTwo.length > 0 ? (
          latestTwo.map((comment) => (
            <div
              key={comment._id}
              onClick={() => navigate(`/post/${post._id}`)}
              className="flex items-start gap-3 mb-3 bg-gray-100 p-3 rounded-lg cursor-pointer"
            >
              <img
                src={
                  comment.commentCreator?.photo &&
                  !comment.commentCreator.photo.includes("undefined")
                    ? comment.commentCreator.photo
                    : DEFAULT_IMAGE
                }
                alt={comment.commentCreator?.name || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold">
                  {comment.commentCreator?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-700">{comment.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No comments yet</p>
        )}
      </div>

      {/* إضافة كومنت */}
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={handleAddComment}
          disabled={addCommentMutation.isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {addCommentMutation.isLoading ? "Sending..." : "Send"}
        </button>
   
      </div>
    </div>
  );
};

export default PostCard;
