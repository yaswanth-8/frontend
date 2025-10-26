import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import EditProfile from "./pages/EditProfile";
import NewPost from "./pages/NewPost";
import { api } from "./api";

type SocialLinks = {
  [key: string]: string | undefined;
  instagram?: string;
};

type ContactInfo = {
  contact_email?: string;
  socials?: SocialLinks;
};

export default function App() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({});

  useEffect(() => {
    let isMounted = true;
    api
      .get("/profile")
      .then(({ data }) => {
        if (!isMounted) return;
        const payload: any = data ?? {};
        const socials =
          payload &&
          typeof payload.socials === "object" &&
          payload.socials !== null
            ? (payload.socials as SocialLinks)
            : undefined;
        setContactInfo({
          contact_email:
            typeof payload.contact_email === "string"
              ? payload.contact_email
              : undefined,
          socials,
        });
      })
      .catch(() => {
        if (isMounted) setContactInfo({});
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const { instagramHref, instagramLabel } = useMemo(() => {
    const rawHandle =
      typeof contactInfo?.socials?.instagram === "string"
        ? contactInfo.socials.instagram.trim()
        : undefined;

    if (!rawHandle) {
      return { instagramHref: undefined, instagramLabel: undefined };
    }

    if (/^https?:\/\//i.test(rawHandle)) {
      try {
        const url = new URL(rawHandle);
        const handle = url.pathname.replace(/\/+$/, "").split("/").filter(Boolean).pop();
        const label = handle ? `@${handle.replace(/^@/, "")}` : rawHandle;
        return { instagramHref: rawHandle, instagramLabel: label };
      } catch {
        return { instagramHref: rawHandle, instagramLabel: rawHandle };
      }
    }

    const handle = rawHandle.replace(/^@/, "");
    return {
      instagramHref: `https://instagram.com/${handle}`,
      instagramLabel: `@${handle}`,
    };
  }, [contactInfo]);

  const currentYear = new Date().getFullYear();

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header" />
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/blog/:slug" element={<Blog/>}/>
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/admin" element={<AdminDashboard/>}/>
          <Route path="/admin/profile" element={<EditProfile/>}/>
          <Route path="/admin/new" element={<NewPost/>}/>
        </Routes>
        <footer className="site-footer">
          <hr className="section-divider" />
          <div className="site-footer-actions">
            <Link to="/admin/login" className="button-secondary">Admin login</Link>
          </div>
          <div className="site-footer-contact">
            {contactInfo.contact_email && (
              <a
                href={`mailto:${contactInfo.contact_email}`}
                className="site-footer-link"
              >
                {contactInfo.contact_email}
              </a>
            )}
            {instagramHref && instagramLabel && (
              <a
                href={instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-link"
              >
                {instagramLabel}
              </a>
            )}
          </div>
          <div className="site-footer-copy">© {currentYear} Yaswanth</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
