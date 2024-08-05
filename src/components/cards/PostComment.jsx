"use client";

import React, { useState } from "react";
import { handleReply } from "@/components/utils/CommentFunctions";
import handler from "@/pages/api/validate-token";
import { redirectToLogin } from "@/utils/navigation";
import { useRouter } from "next/router";
import Alert from "@mui/material/Alert";

const PostComment = ({ user, setNewComment, post_ID, comments, setCommentPosting, commentPosting, isReply = false, parentCommentID = null, onCancel, setShowReply }) => {
  const [replyContent, setReplyContent] = useState("");
  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    handleReply(e, replyContent, user, post_ID, setIsPosting, setIsSuccess, setIsFail, setErrorMessage, isReply, setShowReply, parentCommentID);
  };

  return (
    <React.Fragment>
      {user ? (
        <form className="w-full mb-4" onSubmit={handleSubmit}>
          <div className="relative w-full border rounded-md border-gray-400 overflow-hidden p-2">
            <textarea name="reply_comment" placeholder="Write your reply..." onChange={e => setReplyContent(e.target.value)} className="comment-reply"></textarea>
            <div className="w-full flex justify-end bg-slate-100 rounded p-2">
              {isReply && (
                <div className="btn-cancel hover:cursor-pointer" onClick={onCancel}>
                  Cancel
                </div>
              )}

              <button className="btn ml-2 hover:cursor-pointer" type="submit">
                {isReply ? "Post Reply" : "Post Comment"}
              </button>
            </div>
          </div>
          <div>
            {isPosting && <Alert severity="info">Submitting Reply....</Alert>}
            {isSuccess && <Alert severity="success">Comment submitted successfully!</Alert>}
            {isFail && <Alert severity="error">Error: {errorMessage}</Alert>}
          </div>
        </form>
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
    </React.Fragment>
  );
};

export default PostComment;
