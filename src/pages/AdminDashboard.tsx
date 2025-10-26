import { useEffect } from "react";
import { setToken } from "../api";
import { Link } from "react-router-dom";

export default function AdminDashboard(){
  useEffect(()=>{
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  },[]);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Admin dashboard</h1>
      <div className="flex gap-3">
        <Link to="/admin/new" className="px-3 py-2 bg-black text-white rounded">New post</Link>
        <Link to="/admin/profile" className="px-3 py-2 border rounded">Edit profile</Link>
      </div>
    </div>
  );
}
