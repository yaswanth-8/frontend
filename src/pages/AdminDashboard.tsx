import { useEffect } from "react";
import { setToken } from "../api";
import { Link } from "react-router-dom";

export default function AdminDashboard(){
  useEffect(()=>{
    const t = localStorage.getItem("token");
    if (t) setToken(t);
  },[]);
  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-heading">Admin dashboard</h1>
      <div className="dashboard-actions">
        <Link to="/admin/new" className="button-primary">New post</Link>
        <Link to="/admin/profile" className="button-secondary">Edit profile</Link>
      </div>
    </div>
  );
}
