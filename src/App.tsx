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
      <div className="max-w-3xl mx-auto px-4">
        <header className="py-6 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">simply yaswanth</Link>
          <nav className="space-x-4">
            <Link to="/admin/login" className="text-sm">Admin</Link>
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
        <footer className="py-10 text-center text-sm text-slate-500">© {new Date().getFullYear()} Yaswanth</footer>
      </div>
    </BrowserRouter>
  );
}
