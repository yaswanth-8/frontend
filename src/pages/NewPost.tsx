import { useState, useEffect } from "react";
import { api, setToken, uploadImage } from "../api";

export default function NewPost(){
  const [title,setTitle]=useState(""); const [content,setContent]=useState(""); const [cover,setCover]=useState<File|null>(null);

  useEffect(()=>{ const t=localStorage.getItem("token"); if (t) setToken(t); },[]);

  return (
    <form className="form-stack" onSubmit={async e=>{
      e.preventDefault();
      let cover_url = undefined;
      if (cover) cover_url = await uploadImage(cover);
      await api.post("/blogs", { title, content_md: content, slug: "", cover_url, tags: [] });
      alert("Posted!");
    }}>
      <input className="input-control" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <textarea className="input-control input-control--textarea" placeholder="Markdown content" value={content} onChange={e=>setContent(e.target.value)} />
      <input type="file" className="file-input" onChange={e=>setCover(e.target.files?.[0]||null)} />
      <button className="button-primary">Publish</button>
    </form>
  );
}
