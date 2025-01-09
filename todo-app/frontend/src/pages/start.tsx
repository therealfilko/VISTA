import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Start() {
  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="w-full h-28 bg-transparent">
        <div className="absolute top-7 left-7">
          <Link to="/">
            <img src="/info_logo.svg" alt="Taskify" className="w-12 h-12" />
          </Link>
        </div>
        <Link to="/login">
          <button
            type="submit"
            className="absolute top-7 right-7 btn btn-outline btn-info"
          >
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Start;
