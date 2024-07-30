// pages/login.js
"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import AuthContext from "@/utils/AuthContext";
import Image from "next/image";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useContext(AuthContext);
  const router = useRouter();

  const handleSubmit = e => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <div className="border flex flex-col md:flex-row p-2">
      <div className="w-full md:w-1/3">
        <h1 className="text-lg font-semibold text-center text-secondary500">Login To Join The Conversation</h1>
        <Image src="/images/group.png" alt="Big Brother Junkies" width={200} height={200} className="mx-auto" />
      </div>
      <div className="flex justify-center flex-col items-center grow">
        <form onSubmit={handleSubmit} className="w-1/2">
          <div className="m-4 w-full">
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full" />
          </div>
          <div className="m-4 w-full">
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full" />
          </div>
          <div className="m-4 w-full flex flex-col justify-center items-center">
            <button type="submit" className="btn !w-32 mb-4">
              Login
            </button>
            <div>Forgot Password | Register</div>
          </div>
        </form>
      </div>
    </div>
  );
}
