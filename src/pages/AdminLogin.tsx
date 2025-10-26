import { useState } from "react";
import { api, setToken } from "../api";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [username, setU] = useState(""); const [password, setP] = useState("");
  const nav = useNavigate();
  return (
    <form className="form-stack" onSubmit={async e=>{
      e.preventDefault();
      const res = await api.post("/login",{username, password});
      console.log(res)
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      nav("/admin");
    }}>
      <input value={username} onChange={e=>setU(e.target.value)} className="input-control" placeholder="Username"/>
      <input type="password" value={password} onChange={e=>setP(e.target.value)} className="input-control" placeholder="Password"/>
      <button className="button-primary">Login</button>
    </form>
  );
}
