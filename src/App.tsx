import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import EditProfile from "./pages/EditProfile";
import NewPost from "./pages/NewPost";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="site-header">
          <Link to="/" className="site-title">simply yaswanth</Link>
          <nav className="site-nav">
            <Link to="/admin/login" className="site-nav-link">Admin</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/blog/:slug" element={<Blog/>}/>
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/admin" element={<AdminDashboard/>}/>
          <Route path="/admin/profile" element={<EditProfile/>}/>
          <Route path="/admin/new" element={<NewPost/>}/>
        </Routes>
        <footer className="site-footer">© {new Date().getFullYear()} Yaswanth</footer>
      </div>
    </BrowserRouter>
  );
}
