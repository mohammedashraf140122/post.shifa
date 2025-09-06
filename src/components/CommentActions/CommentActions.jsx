import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function CommentActions({ comment, postId }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(comment.content || "");
  const menuRef = useRef(null);
  const queryClient = useQueryClient();

  // ✅ Get token safely
  const token = localStorage.getItem("userToken")?.trim();

  // 🟢 Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🟢 Edit comment
  const handleEdit = async () => {
    if (!token) {
      toast.error("❌ User token missing, please login again");
      return;
    }

    if (!content.trim()) {
      toast.error("⚠️ Comment cannot be empty");
      return;
    }

    try {
      await axios.put(
        `https://linked-posts.routemisr.com/comments/${comment._id}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("✏️ Comment updated");
      setEditing(false);
    } catch (err) {
      console.error("Edit failed:", err.response?.data || err.message || err);
      toast.error("❌ Failed to update comment");
    }
  };

  // 🟢 Delete comment
  const handleDelete = async () => {
    if (!token) {
      toast.error("❌ User token missing, please login again");
      return;
    }

    if (!comment?._id) {
      toast.error("Comment ID missing");
      return;
    }

    if (!window.confirm("هل متأكد انك عايز تحذف الكومنت؟")) return;

    try {
      await axios.delete(
        `https://linked-posts.routemisr.com/comments/${comment._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      toast.success("🗑️ Comment deleted");
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message || err);
      toast.error("❌ Failed to delete comment");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Dropdown trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="p-1 rounded-full hover:bg-gray-200"
      >
        ⋮
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-28 bg-white border rounded-lg shadow-lg z-10">
          <button
            onClick={() => setEditing(true)}
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

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-full max-w-md shadow-lg">
            <textarea
              className="w-full border p-2 rounded-lg mb-3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1 text-sm text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-sm bg-[#167D56] text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
