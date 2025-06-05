"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: "", author: "", blog: "" });
  const [editId, setEditId] = useState(null);

  const API_URL = "https://blogs-server-production.up.railway.app/blogs";


  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setBlogs(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await fetch(`${API_URL}/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ title: "", author: "", blog: "" });
    setEditId(null);
    fetchBlogs();
  };

  const handleEdit = (blog) => {
    setForm({ title: blog.title, author: blog.author, blog: blog.blog });
    setEditId(blog.id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    fetchBlogs();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "10px" }}>📝 Blog Dashboard</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={{ padding: "8px", marginRight: "10px" }}
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          style={{ padding: "8px", marginRight: "10px" }}
          required
        />
        <input
          type="text"
          placeholder="Blog Content"
          value={form.blog}
          onChange={(e) => setForm({ ...form, blog: e.target.value })}
          style={{ padding: "8px", marginRight: "10px", width: "200px" }}
          required
        />
        <button type="submit" style={{ padding: "8px 12px", backgroundColor: "#0070f3", color: "white", border: "none", cursor: "pointer" }}>
          {editId ? "Update" : "Create"}
        </button>
      </form>

      <div>
        {blogs.map((b) => (
          <div
            key={b.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          >
            <h2 style={{ margin: "0 0 5px 0" }}>{b.title}</h2>
            <p style={{ margin: "0 0 5px 0" }}><strong>Author:</strong> {b.author}</p>
            <p style={{ margin: "0 0 10px 0" }}>{b.blog}</p>
            <button onClick={() => handleEdit(b)} style={{ marginRight: "10px", padding: "6px", background: "orange", color: "white", border: "none" }}>
              Edit
            </button>
            <button onClick={() => handleDelete(b.id)} style={{ padding: "6px", background: "red", color: "white", border: "none" }}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
