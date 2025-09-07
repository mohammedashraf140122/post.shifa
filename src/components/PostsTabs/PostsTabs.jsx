// src/components/PostsTabs/PostsTabs.jsx
import React from "react";

export default function PostsTabs({ activeTab, setActiveTab }) {
  return (
    <div className="flex justify-center gap-6 mb-6 border-b border-gray-200">
      <button
        onClick={() => setActiveTab("all")}
        className={`pb-2 text-lg font-semibold ${
          activeTab === "all"
            ? "text-[#167D56] border-b-2 border-[#167D56]"
            : "text-gray-500 hover:text-[#167D56]"
        }`}
      >
        All Posts
      </button>
      <button
        onClick={() => setActiveTab("user")}
        className={`pb-2 text-lg font-semibold ${
          activeTab === "user"
            ? "text-[#167D56] border-b-2 border-[#167D56]"
            : "text-gray-500 hover:text-[#167D56]"
        }`}
      >
        User Posts & comments
      </button>
    </div>
  );
}
