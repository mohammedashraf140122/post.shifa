import React, { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

const DEFAULT_IMAGE = "/istockphoto-1337144146-612x612.jpg";

export default function CreatePost({ editMode = false, post = {}, onClose }) {
  const [body, setBody] = useState(editMode ? post.body : "");
  const [image, setImage] = useState(editMode ? post.image : null);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();
  const token = localStorage.getItem("userToken");

  // تغيير الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  // إلغاء الصورة
  const handleCancelImage = () => setImage(null);

  // إنشاء أو تعديل البوست
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim() && !image) {
      toast.error("⚠️ لازم تكتب نص أو ترفع صورة!");
      return;
    }

    const formData = new FormData();
    formData.append("body", body);
    if (image instanceof File) formData.append("image", image);
    else if (!image) formData.append("image", "");

    setLoading(true);
    try {
      if (editMode) {
        await axios.put(
          `https://linked-posts.routemisr.com/posts/${post._id}`,
          formData,
          { headers: { token } }
        );
        toast.success("✅ تم تعديل البوست!");
        queryClient.invalidateQueries({ queryKey: ["posts_update"] });
      } else {
        const { data } = await axios.post(
          "https://linked-posts.routemisr.com/posts",
          formData,
          { headers: { token, "Content-Type": "multipart/form-data" } }
        );

        // إضافة البوست الجديد للـ cache
        queryClient.setQueryData(["posts", "all"], (oldPosts) => {
          if (!oldPosts) return { data: [data.post] };
          return { ...oldPosts, data: [data.post, ...oldPosts.data] };
        });

        toast.success("✅ تم إنشاء البوست!");
      }

      setBody("");
      setImage(null);
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      toast.error("❌ حصل خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  // حذف البوست
  const handleDelete = async () => {
    if (!post?._id) return;
    if (!window.confirm("هل متأكد انك عايز تحذف البوست؟")) return;

    setLoading(true);
    try {
      await axios.delete(`https://linked-posts.routemisr.com/posts/${post._id}`, {
        headers: { token },
      });
      toast.success("🗑️ تم حذف البوست");
      queryClient.invalidateQueries({ queryKey: ["posts_delete"] });
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
      toast.error("❌ فشل حذف البوست");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-4 mb-6 border border-[#167D56]/30"
      >
        <div className="flex items-start gap-3">
          <img
            src={DEFAULT_IMAGE}
            alt="user"
            className="w-12 h-12 rounded-full object-cover border border-[#167D56]/40"
          />
          <div className="flex-1">
            <textarea
              placeholder="What's on your mind?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border border-[#167D56]/30 rounded-xl px-3 py-2 text-sm mb-3 resize-none focus:outline-none focus:ring-1 focus:ring-[#167D56]"
            />

            {/* عرض صورة البوست */}
            {image && (
              <div className="relative mb-3">
                <img
                  src={image instanceof File ? URL.createObjectURL(image) : image}
                  alt="preview"
                  className="w-full rounded-xl border border-[#167D56]/30"
                />
                <button
                  type="button"
                  onClick={handleCancelImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-red-600" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between">
              {/* زر إضافة صورة */}
              <label className="cursor-pointer text-sm text-[#167D56] font-medium hover:underline flex items-center gap-1">
                <FontAwesomeIcon icon={faCamera} /> Add Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2">
                {editMode && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={loading}
                    className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600 disabled:opacity-60 flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || (!body.trim() && !image)}
                  className="bg-[#167D56] text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 disabled:opacity-60 flex items-center gap-1"
                >
                  {loading ? "Posting..." : editMode ? "Update" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
