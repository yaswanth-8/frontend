import { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";

interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  content_md?: string;
  cover_url?: string;
  published_at?: string;
  tags?: string[];
}

interface Profile {
  name?: string;
  avatar_url?: string;
  cover_url?: string;
  summary?: string;
  employment_history?: { role: string; company: string; start: string; end?: string; description?: string }[];
  contact_email?: string;
  socials?: Record<string, string>;
}

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, profileRes] = await Promise.all([
          api.get("/blogs"),
          api.get("/profile"),
        ]);

        const postsData = Array.isArray(postsRes.data) ? postsRes.data : [];
        setPosts(postsData);
        setProfile(profileRes.data || null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setPosts([]);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="pb-16">
      {/* Cover image */}
      {profile?.cover_url && (
        <div className="rounded-2xl overflow-hidden mb-8 shadow">
          <img
            src={profile.cover_url}
            alt="Cover"
            className="w-full h-52 object-cover"
          />
        </div>
      )}

      {/* Profile section */}
      <div className="flex items-center gap-4 mb-10">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.name || "Avatar"}
            className="w-16 h-16 rounded-full object-cover border"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-200" />
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {profile?.name || "Yaswanth"}
          </h1>
          <p className="text-slate-600">
            {profile?.summary || "Welcome to my personal blog."}
          </p>
          {profile?.contact_email && (
            <a
              href={`mailto:${profile.contact_email}`}
              className="text-blue-600 text-sm hover:underline"
            >
              {profile.contact_email}
            </a>
          )}
        </div>
      </div>

      {/* Blog posts section */}
      <h2 className="text-xl font-semibold mb-4">Latest Posts</h2>
      {Array.isArray(posts) && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="block border rounded-xl hover:shadow-md transition bg-white"
            >
              {p.cover_url && (
                <img
                  src={p.cover_url}
                  alt={p.title}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-slate-600">
                  {p.published_at
                    ? new Date(p.published_at).toLocaleDateString()
                    : "Unpublished"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 italic">No posts yet.</p>
      )}
    </div>
  );
}
