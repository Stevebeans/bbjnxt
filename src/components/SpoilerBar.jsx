"use client";

import React, { useState, useEffect } from "react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa6";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import Spinner from "@/components/utils/Spinner";
import SpoilerBarCard from "@/components/cards/SpoilerBarCard";
import NavMenu from "@/components/NavMenu";

// get static props

// old classname for the spoilerBarCard container mx-auto flex w-full max-w-6xl translate-y-0 flex-wrap   justify-center  bg-white px-0.5 py-2 shadow-md dark:bg-gray-900 lg:flex lg:w-[975px] lg:gap-4 lg:px-4

const SpoilerBar = () => {
  const [showBar, setShowBar] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [players, setPlayers] = useState([]);

  const FETCH_URL = process.env.NEXT_PUBLIC_API_URL_BBJ;

  //console.log("FETCH_URL", FETCH_URL + "/next_spoiler_bar");

  const { data, error, isValidating } = useSWR(`${FETCH_URL}/next_spoiler_bar`, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 500
  });

  useEffect(() => {
    if (data) {
      setLoadingPlayers(false);
      setPlayers(data);
    }
  }, [data]);

  if (error) return <div>Failed to load</div>;

  return (
    <React.Fragment>
      <div className="flex justify-between w-full bg-primary500 py-1 px-2 border-t border-b border-primary700">
        <div className="hidden md:flex">
          <NavMenu classInfo="flex" />
        </div>
        <div className="flex justify-end items-center text-xs text-white">
          Show Spoiler Bar:
          <button onClick={() => setShowBar(!showBar)} className="py-0.5 px-2 text-white">
            {showBar ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
          </button>
        </div>
      </div>

      <div className="w-full justify-center flex mb-2 z-10">
        <div className="mx-auto w-[95%] lg:w-[1000px] bg-white">
          {showBar && <div className="mx-auto w-full max-w-[1200px] justify-center p-1 shadow-md flex flex-wrap">{loadingPlayers ? <Spinner text={"players"} /> : players.length > 0 && players.map(player => <SpoilerBarCard key={player.player_id} player={player} />)}</div>}
          <div className="z-20 mx-auto flex h-1.5 w-full max-w-7xl  bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-400 shadow "></div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SpoilerBar;
