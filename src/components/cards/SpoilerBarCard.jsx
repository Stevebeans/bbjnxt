import React from "react";
import Image from "next/image";
import Link from "next/link";

const SpoilerBarCard = ({ player }) => {
  const nameMap = {
    afp: "AFP",
    winner: "Winner",
    hoh: "HoH",
    second: "2nd Place",
    pov: "Veto",
    jury: "Jury",
    nom: "Nom",
    evic: "Evicted"
  };

  // if player.status is not null or undefined, then we can use it

  const status = player.status ? player.status : [""];

  const statusColor = player.status ? player.status[0] : "";

  // console.log("player");
  // console.log(player);

  const statusDisplay = status
    .map(place => {
      return nameMap[place] || place; // Look up place in nameMap or use the original place if not found
    })
    .join(", "); // Join the mapped values with a comma and space

  return (
    <div className={`mx-1 text-xs text-center ${statusColor}`}>
      <Link href={player.link}>
        <div className="w-8 md:w-12 flex justify-center mx-auto">
          <Image src={player.image} alt={player.nick ? player.nick : player.first_name} width={100} height={100} className="rounded-xl w-full" />
        </div>
        <div className="font-primaryHeader">{player.nick ? player.nick : player.first_name}</div>
        <h4 className={`text-xs font-mainHead text-center !leading-3 md:!leading-4 tracking-tighter`}>{statusDisplay}</h4>
      </Link>
    </div>
  );
};

export default SpoilerBarCard;
