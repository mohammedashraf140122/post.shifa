import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import PostCard from "../Post/Post";

const fetchSinglePost = async (id) => {
  const token = localStorage.getItem("userToken");
  const res = await axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
    headers: { token },
  });
  return res.data.post;
};

const addComment = async ({ id, text }) => {
  const token = localStorage.getItem("userToken");
  const res = await axios.post(
    `https://linked-posts.routemisr.com/posts/${id}/comment`,
    { text },
    { headers: { token } }
  );
  return res.data;
};

export default function SinglePost() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  // ⬅️ جلب البوست
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["posts", id], // ✅統 key موحّد
    queryFn: () => fetchSinglePost(id),
  });

  // ⬅️ إضافة كومنت جديد
  const mutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      // ✅ حدّث كل البوستات + البوست الحالي
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["posts", id]);
      setCommentText("");
    },
  });

  if (isLoading) return <p>Loading post...</p>;
  if (isError || !post) return <p>Error loading post</p>;

  // ⬅️ ترتيب الكومنتات من الأحدث للأقدم
  const sortedComments = [...(post.comments || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* البوست الأساسي */}
      <PostCard post={post} showAllComments={true} />
    </div>
  );
}
