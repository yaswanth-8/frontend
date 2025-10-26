import { useState, useEffect } from "react";
import { api, setToken } from "../api";

export default function NewPost(){
  const [title,setTitle]=useState(""); const [content,setContent]=useState(""); const [cover,setCover]=useState<File|null>(null);

  useEffect(()=>{ const t=localStorage.getItem("token"); if (t) setToken(t); },[]);

  async function uploadToR2(file: File){
    const key = `covers/${Date.now()}-${file.name}`;
    const r = await api.get("/uploads/sign", { params: { key, content_type: file.type }});
    await fetch(r.data.upload_url, { method: "PUT", body: file, headers: { "Content-Type": file.type }});
    return r.data.public_url;
  }

  return (
    <form className="space-y-4" onSubmit={async e=>{
      e.preventDefault();
      let cover_url = undefined;
      if (cover) cover_url = await uploadToR2(cover);
      await api.post("/blogs", { title, content_md: content, slug: "", cover_url, tags: [] });
      alert("Posted!");
    }}>
      <input className="border p-2 rounded w-full" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="border p-2 rounded w-full h-64" placeholder="Markdown content" value={content} onChange={e=>setContent(e.target.value)} />
      <input type="file" onChange={e=>setCover(e.target.files?.[0]||null)} />
      <button className="px-4 py-2 bg-black text-white rounded">Publish</button>
    </form>
  );
}
