import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Editor from "../Editor";
const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const navigate=useNavigate();


  async function createNewPost(e) {
    const data = new FormData();
    data.append("title", title);
    data.append("summary", summary);
    data.append("content", content);
    data.append("file", files[0]);
    e.preventDefault();
    console.log(files);
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });

    if (response.ok) {
      alert("Post created successfully");
      navigate('/');
    }
  }
  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="summary"
        placeholder="Summary"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />
      <input
        type="file"
        onChange={(e) => setFiles(e.target.files)}
        name="file"
      />
            <Editor value={content} onChange={newValue=>setContent(newValue)}/>
            <button style={{ marginTop: "5px" }}>Create Post</button>
    </form>
  );
};

export default CreatePost;
