"use client";

import React, { useEffect, useState } from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { getFetchCommentsURL } from "@/components/utils/constants";
import { mutate } from "swr";

const CommentVoting = ({ commentID, user, votes, setVotes, totalVotes, post_ID }) => {
  const [userVote, setUserVote] = useState(null);
  const [votingLoading, setVotingLoading] = useState(false);
  const FETCH_URL = getFetchCommentsURL(post_ID);

  const user_ID = user ? user.user_id : null;

  useEffect(() => {
    // set the user vote
    const checkUser = votes.find(vote => vote.user_id == user_ID);

    if (checkUser) {
      setUserVote(checkUser.vote_type == 1 ? "up" : "down");
      console.log("checkUser", checkUser);
    }
  }, [votes, user_ID]);

  // just mutate the votes array for now

  // first get the initial vote count and set that state

  // console.log("=====================");
  // console.log("votes", votes);
  // console.log("comment ID", commentID);
  // console.log("user", user);
  // console.log("total votes");
  // console.log(totalVotes);

  // console.log("user vote", userVote);
  // console.log("=====================");

  const countColor = totalVotes > 0 ? "text-green-500" : totalVotes < 0 ? "text-red-500" : "text-gray-500";

  const handleVote = async type => {
    console.log(type);
    console.log(FETCH_URL);
    mutate(getFetchCommentsURL(post_ID));
  };

  return (
    <React.Fragment>
      <div className="hover:cursor-pointer mr-2">
        <FaAngleUp className={` ${userVote === "up" ? "text-green-500" : "text-gray-300"}`} onClick={() => handleVote("up")} disabled={votingLoading} />
      </div>
      <div className={`font-bold ${countColor}`}>{totalVotes}</div>
      <div className="hover:cursor-pointer ml-2">
        <FaAngleDown className={` ${userVote === "down" ? "text-red-500" : "text-gray-300"}`} onClick={() => handleVote("down")} disabled={votingLoading} />
      </div>
    </React.Fragment>
  );
};

export default CommentVoting;
