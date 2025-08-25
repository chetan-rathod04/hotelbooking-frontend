// src/components/UploadAvatar.jsx
import React, { useState, useEffect } from "react";
import { uploadAvatar, getAvatar } from "../api/avatarApi";

const UploadAvatar = () => {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState("");

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleUpload = async () => {
    try {
      await uploadAvatar(avatar);
      alert("Avatar uploaded successfully");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const fetchAvatar = async () => {
    try {
      const res = await getAvatar();
      setPreview(`data:image/jpeg;base64,${res.data}`);
    } catch (err) {
      console.error("Fetch avatar failed", err);
    }
  };

  useEffect(() => {
    fetchAvatar();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Profile Avatar</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 mt-2"
      >
        Upload
      </button>
      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Avatar"
            className="w-32 h-32 rounded-full border"
          />
        </div>
      )}
    </div>
  );
};

export default UploadAvatar;
