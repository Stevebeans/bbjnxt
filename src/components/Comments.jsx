"use client";

import React, { useState, useContext } from "react";
import SubHeader from "./utils/SubHeader";
import AuthContext from "@/utils/AuthContext";
import { redirectToLogin } from "@/utils/navigation";
import { useRouter } from "next/router";
import CommentCard from "./cards/Comment";

const Comments = ({ comments, comment_count }) => {
  const [sortOrder, setSortOrder] = useState("newest");
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const nestedCommentsBuilder = (comments, parent) => {
    return comments
      .filter(comment => comment.parent === parent)
      .map(comment => ({
        ...comment,
        children: nestedCommentsBuilder(comments, comment.id)
      }));
  };

  // loop through comments and add children to first level
  const nestedReplies = (comments, parents) => {
    return parents.map(parent => {
      const children = nestedCommentsBuilder(comments, parent.id);
      return {
        ...parent,
        children: children.length ? nestedReplies(comments, children) : []
      };
    });
  };

  const handleSortChange = e => {
    setSortOrder(e.target.value);
  };

  const sortedComments = [...comments].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.comment_date) - new Date(a.comment_date);
    } else if (sortOrder === "oldest") {
      return new Date(a.comment_date) - new Date(b.comment_date);
    } else if (sortOrder === "popular") {
      return b.comment_likes - a.comment_likes;
    } else if (sortOrder === "least") {
      return a.comment_likes - b.comment_likes;
    }
  });

  const post_ID = comments[0].post_ID;

  if (!comments.length) {
    return <p>No comments yet. Be the first to comment!</p>;
  }

  //console.log("Comments", comments);
  return (
    <section className="p-2">
      <div className="flex justify-between items-center mb-4 border-b border-primary400">
        <div>
          <SubHeader title={`${comment_count} Comments`} />
        </div>
        <div>
          <label htmlFor="sortOrder" className="mr-2">
            Sort by:
          </label>
          <select id="sortOrder" value={sortOrder} onChange={handleSortChange} className="border p-1 rounded">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Most Popular</option>
            <option value="least">Least Popular</option>
          </select>
        </div>
      </div>

      <div className="">
        {user ? (
          <div>Post</div>
        ) : (
          <div className="flex items-center justify-center">
            <p className="text-sm">
              Please{" "}
              <a onClick={() => redirectToLogin(router)} className="hover:cursor-pointer text-primary400 underline font-semibold">
                Log In
              </a>{" "}
              to post a comment
            </p>
          </div>
        )}
      </div>

      {sortedComments.map(comment => (
        <div className="mb-10" key={comment.comment_ID}>
          <CommentCard comment={comment} />
        </div>
      ))}
    </section>
  );
};

export default Comments;
