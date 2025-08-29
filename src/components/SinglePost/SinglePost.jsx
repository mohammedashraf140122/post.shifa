import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import PostCard from './../Post/Post';

const fetchPostById = async (id, token) => {
  const res = await axios.get(
    `https://linked-posts.routemisr.com/posts/${id}`,
    {
      headers: {
        token: token, // مش Authorization
      },
    }
  );
  return res.data;
};

export default function SinglePost() {
  const { id } = useParams();
  const token = localStorage.getItem("Atoken"); // أو اللي انت مسميه

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id, token),
    enabled: !!token, // متعملش request إلا لو في توكن
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>حدث خطأ أثناء تحميل البوست</p>;

  return (
    <div className="container mx-auto mt-5">
      <PostCard post={post} />
    </div>
  );
}
