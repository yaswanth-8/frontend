import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, resolvePublicUrl } from "../api";
import Markdown from "markdown-to-jsx";

export default function Blog() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data } = await api.get(`/blogs/${slug}`);
        setPost({
          ...data,
          cover_url: resolvePublicUrl(data.cover_url) ?? data.cover_url,
        });
      } catch (error) {
        console.error("Failed to load blog post", error);
        setPost(null);
      }
    }
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (!post) return null;
  return (
    <article className="blog-article">
      <h1>{post.title}</h1>
      {post.cover_url && <img src={post.cover_url} alt={post.title} className="blog-article-cover" />}
      <Markdown>{post.content_md}</Markdown>
    </article>
  );
}
