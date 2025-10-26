import { useEffect, useState } from "react";
import { api, setToken } from "../api";

export default function EditProfile(){
  const [profile, setProfile] = useState<any>({ name:"Yaswanth", summary:"", employment_history:[], socials:{}, contact_email:"" });
  useEffect(()=>{ const t=localStorage.getItem("token"); if (t) setToken(t); api.get("/profile").then(r=>setProfile({...profile,...r.data})) },[]);
  async function upload(file: File, keyPrefix: string){
    const key = `${keyPrefix}/${Date.now()}-${file.name}`;
    const r = await api.get("/uploads/sign", { params: { key, content_type: file.type }});
    await fetch(r.data.upload_url, { method: "PUT", body: file, headers: { "Content-Type": file.type }});
    return r.data.public_url;
  }
  return (
    <form className="space-y-4" onSubmit={async e=>{
      e.preventDefault();
      await api.put("/profile", profile);
      alert("Saved!");
    }}>
      <input className="border p-2 rounded w-full" placeholder="Name" value={profile.name||""} onChange={e=>setProfile({...profile,name:e.target.value})}/>
      <textarea className="border p-2 rounded w-full" placeholder="Summary" value={profile.summary||""} onChange={e=>setProfile({...profile,summary:e.target.value})}/>
      <input className="border p-2 rounded w-full" placeholder="Contact email" value={profile.contact_email||""} onChange={e=>setProfile({...profile,contact_email:e.target.value})}/>
      <div className="flex gap-2">
        <input type="file" onChange={async e=>{ const f=e.target.files?.[0]; if (f) setProfile({...profile,avatar_url:await upload(f,"avatars")}); }} />
        <input type="file" onChange={async e=>{ const f=e.target.files?.[0]; if (f) setProfile({...profile,cover_url:await upload(f,"covers")}); }} />
      </div>
      <button className="px-4 py-2 bg-black text-white rounded">Save</button>
    </form>
  );
}
