import React, { useState, useEffect, useRef } from "react";
import api from "../../api/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import CreatePost from "../CreatePost/CreatePost";
import CommentActions from "../CommentActions/CommentActions"; // ✅ استدعاء الكومبوننت الجديد

const DEFAULT_IMAGE = "/istockphoto-1337144146-612x612.jpg";

const PostCard = ({ post, showAllComments = false }) => {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const menuRef = useRef(null);
  const queryClient = useQueryClient();
  const token = localStorage.getItem("userToken");
  const navigate = useNavigate();

  let currentUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      currentUserId = decoded.user || decoded.userId;
    } catch {}
  }

  // ✅ إغلاق منيو البوست
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ ترتيب الكومنتات
  const sortedComments = [...(post.comments || [])].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  );
  const commentsToShow = showAllComments ? sortedComments : sortedComments.slice(-1);

  // ✅ إضافة كومنت
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);

    try {
      await api.post(
        "https://linked-posts.routemisr.com/comments",
        { content: newComment, post: post._id },
        { headers: { token, "Content-Type": "application/json" } }
      );

      setNewComment("");
      // بعد إضافة كومنت، حدّث البوستات والبوست الحالي (لو مستخدم في صفحة سينجل)
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", post._id] });
      toast.success("💬 Comment added");
    } catch {
      toast.error("❌ Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  // ✅ حذف البوست
  const handleDelete = async () => {
    try {
      await api.delete(`https://linked-posts.routemisr.com/posts/${post._id}`, {
        headers: { token },
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts", currentUserId] });

      toast.success("🗑️ Post deleted");
    } catch {
      toast.error("❌ Failed to delete post");
    } finally {
      setShowMenu(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-5 mb-6 border border-[#167D56]/30 relative">
      {/* بيانات البوست */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={
            post.user?.photo && !post.user.photo.includes("undefined")
              ? post.user.photo
              : DEFAULT_IMAGE
          }
          alt={post.user?.name || "User"}
          className="w-12 h-12 rounded-full object-cover border-2 border-[#167D56]"
        />
        <div className="flex-1">
          <p className="font-semibold text-[#167D56]">
            {post.user?.name || "Unknown User"}
          </p>
          <span className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString()}
          </span>
        </div>

        {/* منيو الأكشنز للبوست */}
        {post.user?._id === currentUserId && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-gray-200"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setShowEdit(true);
                    setShowMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* نص وصورة البوست */}
      <div
        className="mb-3 cursor-pointer"
        onClick={() => navigate(`/post/${post._id}`)}
      >
        {post.body && <p className="text-gray-700 mb-2">{post.body}</p>}
        {post.image && !post.image.includes("undefined") && (
          <img
            src={post.image}
            alt="post"
            className="w-full h-auto rounded-lg border border-[#167D56]/20"
          />
        )}
      </div>

      {/* الأكشنز */}
      <div className="flex justify-around text-sm border-t border-b border-[#167D56]/30 py-2 mb-3 text-[#167D56]">
        <button
          className="flex items-center gap-1 hover:text-green-700 cursor-pointer"
          onClick={() => navigate(`/post/${post._id}`)}
        >
          💬 Comment
        </button>
        <button className="flex items-center gap-1 hover:text-green-700 cursor-pointer">
          ↗ Share
        </button>
        <button className="flex items-center gap-1 hover:text-green-700 cursor-pointer">
          🔖 Save
        </button>
      </div>

      {/* إضافة كومنت */}
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 border border-[#167D56]/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#167D56]"
        />
        <button
          type="button"
          onClick={handleAddComment}
          disabled={loading || !newComment.trim()}
          className="bg-[#167D56] text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-80"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      {/* عرض الكومنتات */}
      <div className="mt-4">
        {commentsToShow.length > 0 ? (
          commentsToShow.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start gap-3 mb-3 bg-gray-50 border border-[#167D56]/20 p-3 rounded-lg relative"
            >
              <img
                src={
                  comment.commentCreator?.photo &&
                  !comment.commentCreator.photo.includes("undefined")
                    ? comment.commentCreator.photo
                    : DEFAULT_IMAGE
                }
                alt={comment.commentCreator?.name || "User"}
                className="w-10 h-10 rounded-full object-cover border border-[#167D56]/50"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#167D56]">
                  {comment.commentCreator?.name || "Unknown"}
                </p>
                <p className="text-sm text-gray-700">{comment.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>

              {/* ✅ زر منيو للكومنت بتاعي بس */}
              {comment.commentCreator?._id === currentUserId && (
                <CommentActions comment={comment} postId={post._id} />
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">
            {showAllComments ? "No comments yet" : "No recent comment"}
          </p>
        )}
      </div>

      {/* مودال Edit Post */}
      {showEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-full max-w-lg shadow-lg">
            <CreatePost
              editMode={true}
              post={post}
              onClose={() => setShowEdit(false)}
            />
            <button
              onClick={() => setShowEdit(false)}
              className="mt-2 text-sm text-red-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
