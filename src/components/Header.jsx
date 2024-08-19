import React, { useContext } from "react";
import SpoilerBar from "@/components/SpoilerBar";
import Link from "next/link";
import AuthContext from "@/utils/AuthContext";
import Image from "next/image";
import SpoilerUpdateBar from "./SpoilerUpdateBar";
import { feedUpdater } from "@/utils/userCheck";

const Header = () => {
  const { user } = useContext(AuthContext);

  const feedCheck = feedUpdater(user);

  console.log("feed chcker", feedCheck);

  return (
    <div className="">
      <div className="py-2 bg-white">
        <Link href="/">
          <Image
            src="/images/mainlogo.jpg"
            alt="Big Brother Junkies - Live Feed Spoilers"
            width={395}
            height={37}
            stlye={{
              width: "100%",
              height: "auto"
            }}
          />
        </Link>
      </div>
      <SpoilerBar />
      {feedCheck && <SpoilerUpdateBar />}
    </div>
  );
};

export default Header;
