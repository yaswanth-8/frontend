import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import Markdown from "markdown-to-jsx";

export default function Blog() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => { api.get(`/blogs/${slug}`).then(r => setPost(r.data)); }, [slug]);

  if (!post) return null;
  return (
    <article className="prose max-w-none">
      <h1>{post.title}</h1>
      {post.cover_url && <img src={post.cover_url} />}
      <Markdown>{post.content_md}</Markdown>
    </article>
  );
}
