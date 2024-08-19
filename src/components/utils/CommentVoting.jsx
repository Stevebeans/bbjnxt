"use client";

import React, { use, useEffect, useState } from "react";
import { FaAngleUp, FaAngleDown } from "react-icons/fa";
import { getFetchCommentsURL } from "@/components/utils/constants";
import Alert from "@mui/material/Alert";
import { FaX } from "react-icons/fa6";
import { mutate } from "swr";
import { redirectToLogin } from "@/utils/navigation";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import axios from "axios";

const CommentVoting = ({ commentID, user, votes, setVotes, totalVotes, post_ID, setLoggedIn }) => {
  const [userVote, setUserVote] = useState(null);
  const [votingLoading, setVotingLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [upvotes, setUpvotes] = useState(0);
  const [voteTotal, setVoteTotal] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const FETCH_URL = getFetchCommentsURL(post_ID);
  const router = useRouter();
  const VOTE_URL = `${process.env.NEXT_PUBLIC_API_URL_BBJ}/comment_vote`;

  const user_ID = user ? user.user_id : null;
  const token = Cookies.get("token");

  useEffect(() => {
    // set the initial vote total

    let upVotes = 0;
    let downVotes = 0;

    votes.forEach(vote => {
      if (vote.vote_type == 1) {
        upVotes += 1;
      }
      if (vote.vote_type == -1) {
        downVotes += 1;
      }
    });

    setUpvotes(upVotes);
    setDownvotes(downVotes);

    const voteCountTotal = upVotes - downVotes;

    setVoteTotal(voteCountTotal);
  }, [votes, user_ID]);

  useEffect(() => {
    if (user) {
      // look for votes by user on the comment_id and set the user vote
      const userVote = votes.find(vote => vote.user_id == user_ID);

      if (userVote) {
        setUserVote(userVote.vote_type == 1 ? "up" : "down");
      }
    }
  }, [user, votes]);

  const countColor = totalVotes > 0 ? "text-green-500" : totalVotes < 0 ? "text-red-500" : "text-gray-500";

  const handleVote = async type => {
    const unixDate = new Date().getTime();

    // if userVote = type then return

    if (userVote === type) {
      return;
    }

    if (!user) {
      setShowAlert(true);
      return;
    }

    setVotingLoading(true);

    const isUpVote = type === "up";
    const newVoteType = isUpVote ? 1 : -1;

    // Optimistic update
    const updatedVotes = [...votes];
    let newTotalVotes = totalVotes;

    const existingVoteIndex = updatedVotes.findIndex(vote => {
      return vote.user_id == user_ID;
    });

    if (existingVoteIndex > -1) {
      // User already voted, remove previous vote
      const previousVoteType = updatedVotes[existingVoteIndex].vote_type;
      console.log("previous vote type", previousVoteType);
      updatedVotes.splice(existingVoteIndex, 1);
      newTotalVotes -= previousVoteType;
    }

    // Add new vote
    updatedVotes.push({ user_id: user_ID, vote_type: newVoteType });
    newTotalVotes += newVoteType;

    // Update state with optimistic vote
    setVotes(updatedVotes);
    setUserVote(type);
    //mutate(FETCH_URL, { ...updatedVotes, totalVotes: newTotalVotes }, false);

    // convert details to string as that's how they're stored

    try {
      const res = await axios.post(
        VOTE_URL,
        {
          comment_id: commentID.toString(),
          user_id: user_ID.toString(),
          post_id: post_ID.toString(),
          vote: newVoteType.toString(),
          date: unixDate.toString()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.status === 200) {
        setVotingLoading(false);
        mutate(FETCH_URL);
      }
      if (res.status !== 200) {
        // Revert optimistic update on failure
        setVotes(votes);
        setUserVote(existingVoteIndex > -1 ? (votes[existingVoteIndex].vote_type === 1 ? "up" : "down") : null);
      }
    } catch (error) {
      console.error("Voting failed", error);
      // Revert optimistic update on failure
      setVotes(votes);
      setUserVote(existingVoteIndex > -1 ? (votes[existingVoteIndex].vote_type === 1 ? "up" : "down") : null);
      setVotingLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="hover:cursor-pointer mr-2">
        <FaAngleUp className={` ${userVote === "up" ? "text-green-500 hover:cursor-default" : "text-gray-300"}`} onClick={() => handleVote("up")} disabled={votingLoading} />
      </div>
      <div className={`font-bold ${countColor}`}>{voteTotal}</div>
      <div className="hover:cursor-pointer ml-2">
        <FaAngleDown className={` ${userVote === "down" ? "text-red-500" : "text-gray-300"}`} onClick={() => handleVote("down")} disabled={votingLoading} />
      </div>
      {showAlert && (
        <Alert severity="error">
          <div className="flex items-center">
            Please{" "}
            <a onClick={() => redirectToLogin(router)} className="font-semibold underline hover:cursor-pointer mx-1">
              log in
            </a>{" "}
            to vote <FaX className="ml-2" onClick={() => setShowAlert(false)} />
          </div>
        </Alert>
      )}
    </React.Fragment>
  );
};

export default CommentVoting;
