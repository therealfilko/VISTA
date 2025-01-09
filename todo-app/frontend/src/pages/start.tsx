import React from "react";
import { Link } from "react-router-dom";
import "../components/layout/navbar.css";

function Start() {
  return (
    <div className="relative flex min-h-screen bg-neutral-950">
      <header className="header">
        <a href="/" className="logo">
          <img src="/accent_logo.svg" alt="Taskify" className="w-10 h-10" />
        </a>

        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Portfolio</a>
          <a href="/">Services</a>
          <a href="/">Contact</a>
        </nav>
      </header>
    </div>
  );
}

export default Start;
