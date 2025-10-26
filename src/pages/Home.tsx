import { useEffect, useState } from "react";
import { api, resolvePublicUrl } from "../api";
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
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [showAvatarMessage, setShowAvatarMessage] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, profileRes] = await Promise.all([
          api.get("/blogs"),
          api.get("/profile"),
        ]);

        const postsData = Array.isArray(postsRes.data) ? postsRes.data : [];
        setPosts(
          postsData.map((p) => ({
            ...p,
            cover_url: resolvePublicUrl(p.cover_url) ?? p.cover_url,
          })),
        );
        const profileData = profileRes.data
          ? {
              ...profileRes.data,
              cover_url:
                resolvePublicUrl(profileRes.data.cover_url) ??
                profileRes.data.cover_url,
              avatar_url:
                resolvePublicUrl(profileRes.data.avatar_url) ??
                profileRes.data.avatar_url,
            }
          : null;
        setProfile(profileData);
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

  useEffect(() => {
    if (!showAvatarMessage) {
      return;
    }
    const timer = window.setTimeout(() => setShowAvatarMessage(false), 1800);
    return () => window.clearTimeout(timer);
  }, [showAvatarMessage]);

  function handleAvatarClick() {
    if (!profile?.avatar_url) {
      return;
    }
    setIsAvatarModalOpen(true);
    setShowAvatarMessage(true);
  }

  function handleAvatarClose() {
    setIsAvatarModalOpen(false);
    setShowAvatarMessage(false);
  }

  useEffect(() => {
    if (!isAvatarModalOpen) {
      return;
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleAvatarClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAvatarModalOpen]);

  if (loading) {
    return (
      <div className="home-loading">
        Loading...
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Cover image */}
      {profile?.cover_url && (
        <div className="profile-cover">
          <img
            src={profile.cover_url}
            alt="Cover"
            className="profile-cover-image"
          />
        </div>
      )}

      {/* Profile section */}
      <div className="profile-overview">
        {profile?.avatar_url ? (
          <button
            type="button"
            className="profile-avatar-trigger"
            onClick={handleAvatarClick}
            aria-label="View profile photo"
          >
            <img
              src={profile.avatar_url}
              alt={profile.name || "Avatar"}
              className="profile-avatar"
            />
          </button>
        ) : (
          <div className="profile-avatar-placeholder" />
        )}
        <div>
          <h1 className="profile-name">
            {profile?.name || "Yaswanth"}
          </h1>
          <p className="profile-summary">
            {profile?.summary || "Welcome to my personal blog."}
          </p>
          {profile?.contact_email && (
            <a
              href={`mailto:${profile.contact_email}`}
              className="profile-contact"
            >
              {profile.contact_email}
            </a>
          )}
        </div>
      </div>

      {/* Blog posts section */}
      <h2 className="section-heading">Latest Posts</h2>
      {Array.isArray(posts) && posts.length > 0 ? (
        <div className="post-feed">
          {posts.map((p) => (
            <Link
              key={p.slug}
              to={`/blog/${p.slug}`}
              className="post-card"
            >
              {p.cover_url && (
                <img
                  src={p.cover_url}
                  alt={p.title}
                  className="post-card-image"
                />
              )}
              <div className="post-card-body">
                <h3 className="post-card-title">{p.title}</h3>
                <p className="post-card-meta">
                  {p.published_at
                    ? new Date(p.published_at).toLocaleDateString()
                    : "Unpublished"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="empty-state">No posts yet.</p>
      )}
      {isAvatarModalOpen && profile?.avatar_url && (
        <div
          className="avatar-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={handleAvatarClose}
        >
          <button
            type="button"
            className="avatar-modal-close"
            onClick={handleAvatarClose}
            aria-label="Close profile photo"
          >
            ×
          </button>
          {showAvatarMessage && (
            <div className="avatar-modal-message">
              Oh you want to see me ❤️
            </div>
          )}
          <img
            src={profile.avatar_url}
            alt={profile.name || "Avatar enlarged"}
            className="avatar-modal-image"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
