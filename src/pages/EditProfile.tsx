import { useEffect, useState } from "react";
import { api, resolvePublicUrl, setToken, uploadImage } from "../api";

export default function EditProfile(){
  const [profile, setProfile] = useState<any>({ name:"Yaswanth", summary:"", employment_history:[], socials:{}, contact_email:"" });
  useEffect(()=>{ const t=localStorage.getItem("token"); if (t) setToken(t); api.get("/profile").then(r=>{
    const data = r.data || {};
    setProfile((prev: any) => ({
      ...prev,
      ...data,
      avatar_url: resolvePublicUrl(data.avatar_url) ?? data.avatar_url,
      cover_url: resolvePublicUrl(data.cover_url) ?? data.cover_url,
    }));
  }) },[]);
  return (
    <form className="form-stack" onSubmit={async e=>{
      e.preventDefault();
      await api.put("/profile", profile);
      alert("Saved!");
    }}>
      <input className="input-control" placeholder="Name" value={profile.name||""} onChange={e=>setProfile({...profile,name:e.target.value})}/>
      <textarea className="input-control input-control--textarea" placeholder="Summary" value={profile.summary||""} onChange={e=>setProfile({...profile,summary:e.target.value})}/>
      <input className="input-control" placeholder="Contact email" value={profile.contact_email||""} onChange={e=>setProfile({...profile,contact_email:e.target.value})}/>
      <div className="inline-actions">
        <input type="file" className="file-input" onChange={async e=>{ const f=e.target.files?.[0]; if (f) setProfile({...profile,avatar_url:await uploadImage(f)}); }} />
        <input type="file" className="file-input" onChange={async e=>{ const f=e.target.files?.[0]; if (f) setProfile({...profile,cover_url:await uploadImage(f)}); }} />
      </div>
      <button className="button-primary">Save</button>
    </form>
  );
}
