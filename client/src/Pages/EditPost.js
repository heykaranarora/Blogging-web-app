import React, { useState,useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import "../App.css";
import { useNavigate, useParams } from "react-router-dom";
import Editor from "../Editor";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch("http://localhost:4000/post/" + id);
        const postInfo = await response.json();
        setTitle(postInfo.title);
        setSummary(postInfo.summary);
        setContent(postInfo.content);
      } catch (error) {
        console.error("Failed to fetch post data", error);
      }
    }
    if (id) {
      fetchPost();
    }
  }, [id]);

  async function editPost(e) {
    const data = new FormData();
    data.append("title", title);
    data.append("summary", summary);
    data.append("content", content);
    data.append("id", id);
    if (files?.[0]) {
      data.append("file", files?.[0]);
    }
    e.preventDefault();
    console.log(files);
    const response = await fetch("http://localhost:4000/post", {
      method: "PUT",
      body: data,
      credentials: "include",
    });
    if (response.ok) {
      alert("Post updated successfully");
      navigate(`/post/${id}`);
    }
  }

  return (
    <form onSubmit={editPost}>
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
      <Editor value={content} onChange={(newValue) => setContent(newValue)} />
      <button style={{ marginTop: "5px" }}>Edit Post</button>
    </form>
  );
};

export default EditPost;
