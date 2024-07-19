import React, { useContext } from "react";
import SpoilerBar from "./SpoilerBar";
import Link from "next/link";
import AuthContext from "@/utils/AuthContext";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <div className="flex">
        <Link href="/">Home</Link>
        <Link href="/login">Login</Link>
        <Link href="/dashboard">Dashboard</Link>

        {user && <Link href="/profile">Profile for {user.user_display_name}</Link>}
      </div>
      <SpoilerBar />
    </div>
  );
};

export default Header;
