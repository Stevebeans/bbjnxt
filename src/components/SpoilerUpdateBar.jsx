"user client";
import React, { useState, useEffect } from "react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa6";
import Cookies from "js-cookie";

const SpoilerUpdateBar = () => {
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const cookie = Cookies.get("feed_updater");
    console.log("COOKIE", cookie);

    setShowBar(cookie === "true");
  }, []);

  const barClick = () => {
    console.log("click");

    // Calculate the new state value
    const newShowBar = !showBar;

    // Update the state
    setShowBar(newShowBar);

    // Set the cookie based on the new state value
    Cookies.set("feed_updater", newShowBar ? "true" : "false", { expires: 365 });
  };

  console.log("showBar", showBar);

  return (
    <div className="fixed bottom-0 w-full z-50 justify-center">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between bg-primary500 font-bold p-2 rounded-t-lg">
          <div className="text-white ">WELCOME FEED UPDATER</div>
          <div className="flex justify-center">
            <button onClick={barClick} className="text-white text-2xl">
              {showBar ? <FaToggleOn /> : <FaToggleOff />}
            </button>
          </div>
        </div>
        {showBar && <div className="w-full bg-white p-2">Hey</div>}
      </div>
    </div>
  );
};

export default SpoilerUpdateBar;
