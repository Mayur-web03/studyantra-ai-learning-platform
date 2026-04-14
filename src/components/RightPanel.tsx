import React, { useState, useEffect } from "react";

const subjects = ["DSA", "OOPS", "OS", "SE", "WD"];

const RightPanel: React.FC = () => {
  const [active, setActive] = useState("DSA");

  useEffect(() => {
    const saved = localStorage.getItem("active_subject");
    if (saved) setActive(saved);
  }, []);

  const handleClick = (sub: string) => {
    setActive(sub);
    localStorage.setItem("active_subject", sub);
    window.dispatchEvent(new Event("subjectChanged"));
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",   // 🔥 vertical center
        alignItems: "center",
        gap: "14px",
        padding: "10px"
      }}
    >
      {subjects.map((s) => (
        <button
          key={s}
          onClick={() => handleClick(s)}
          style={{
            width: "90px",
            padding: "10px",
            borderRadius: "20px",
            border: "none",
            background: active === s ? "#3A7CA5" : "#EEF2F7",
            color: active === s ? "#fff" : "#333",
            cursor: "pointer",
            fontWeight: "500",
            transition: "0.2s",
            boxShadow: active === s
              ? "0 4px 10px rgba(0,0,0,0.15)"
              : "none"
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
};

export default RightPanel;