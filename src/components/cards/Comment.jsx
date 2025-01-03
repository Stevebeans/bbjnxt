"use client";
import React, { useContext, useState, useEffect, use } from "react";
import Image from "next/image";
import BeansTimeAgo from "@/components/utils/TimeAgo";
import Link from "next/link";
import { rankCalc, rankColors } from "@/utils/rankCalc";
import { sanitizeContent } from "@/components/utils/CommentFunctions";
import htmlParser from "html-react-parser";
import { FaReply, FaAngleUp, FaAngleDown } from "react-icons/fa";
import AuthContext from "@/utils/AuthContext";
import { useRouter } from "next/router";
import PostComment from "./PostComment";
import CommentVoting from "../utils/CommentVoting";
import { redirectToLogin } from "@/utils/navigation";

const CommentCard = ({ comment, depth = 0, setNewComment, post_ID, comments, setCommentPosting, commentPosting, showReply, setShowReply }) => {
  const [userVote, setUserVote] = useState(null);
  const [votingLoading, setVotingLoading] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [hideComment, setHideComment] = useState(false);
  const [commentID, setCommentID] = useState(null);
  const [votes, setVotes] = useState([]);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setVotes(comment.all_votes);
    setCommentID(comment.comment_ID);
  }, [comment]);

  useEffect(() => {
    // map through votes and calculate a +1 for 1 and -1 for 0 in the field vote_type
    const total = votes.reduce((acc, vote) => (vote.vote_type == 1 ? acc + 1 : acc - 1), 0);
    setTotalVotes(total);
  }, [votes]); // Include votes in the dependency array

  // hide bad comments
  useEffect(() => {
    if (totalVotes < -5) {
      setHideComment(true);
    }
  }, [totalVotes]);

  // console.log("hide comment", hideComment);

  // console.log("votes", votes);
  // console.log("author", comment.comment_author);

  const depthColor = depth === 0 ? "shadow-lg" : "";

  const userRank = rankCalc(comment.user_rank);

  const handleReplyClick = () => setShowReply(!showReply);
  const handleCancel = () => {
    setShowReply(false);
  };

  return (
    <section className="mb-10">
      {hideComment && <div className="text-red-500">This comment has been hidden due to low votes</div>}
      {!hideComment && (
        <div className={`p-2 mb-2 rounded-md flex items-center border-2 border-slate-100 ${depthColor}`}>
          <div className="w-12 h-12 p-1 border rounded-full self-start">
            <Image src={comment.comment_author_avatar} alt={comment.comment_author} height={40} width={40} className="rounded-full w-10 h-10" />
          </div>
          <div className="ml-2 flex flex-col justify-center w-full">
            <div className="text-xs text-secondary600 py-1 px-1 ">
              <BeansTimeAgo date={comment.comment_date} />
            </div>

            <div className="font-semibold border-b border-gray-300 pb-1 mb-2 flex items-center  px-1">
              <div className="text-slate-500">{comment.comment_author}</div>
              {userRank && <div>{userRank}</div>}
              Comment ID - {comment.comment_ID} Post ID {comment.post_ID}
            </div>
            <div className="text-gray-600 prose max-w-none">{htmlParser(comment.comment_content)}</div>
            <div className="flex items-center">
              <CommentVoting commentID={commentID} user={user} votes={votes} setVotes={setVotes} totalVotes={totalVotes} post_ID={post_ID} />
              {user ? (
                <>
                  {depth < 3 && (
                    <div className="ml-4 hover:cursor-pointer flex items-center" onClick={handleReplyClick}>
                      <FaReply className="text-primary500 mr-2" /> Reply
                    </div>
                  )}
                </>
              ) : (
                <div className="ml-4 text-xs">
                  <a onClick={() => redirectToLogin(router)} className="font-semibold underline hover:cursor-pointer">
                    Log In to Reply
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showReply && (
        <div className="ml-16 mb-4">
          <PostComment user={user} setNewComment={setNewComment} post_ID={post_ID} comments={comments} setCommentPosting={setCommentPosting} commentPosting={commentPosting} isReply={true} parentCommentID={comment.comment_ID} onCancel={handleCancel} setShowReply={setShowReply} />
        </div>
      )}
      {comment.replies.length > 0 && (
        <div className="ml-8">
          {comment.replies.map(reply => (
            <div className="mb-2" key={reply.comment_ID}>
              <CommentCard comment={reply} depth={depth + 1} setNewComment={setNewComment} post_ID={post_ID} comments={comments} setCommentPosting={setCommentPosting} commentPosting={commentPosting} setShowReply={setShowReply} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentCard;

// import React, { useContext, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import BeansTimeAgo from "@/components/utils/TimeAgo";
// import { rankCalc, rankColors } from "@/utils/rankCalc";
// import htmlParser from "html-react-parser";
// import sanitizeHtml from "sanitize-html";
// import AuthContext from "@/utils/AuthContext";
// import { FaReply, FaAngleUp, FaAngleDown } from "react-icons/fa";
// import MyModal from "@/components/utils/Modal";
// import { handleReply } from "@/utils/handleReply";
// import Alert from "@mui/material/Alert";

// const CommentCard = ({ comment, depth = 0, addComment, setComments }) => {
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [upVote, setUpVote] = useState(0);
//   const [downVote, setDownVote] = useState(0);
//   const [totalVotes, setTotalVotes] = useState(0);
//   const [userVote, setUserVote] = useState(null);
//   const [showReply, setShowReply] = useState(false);
//   const [replyContent, setReplyContent] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [replySuccess, setReplySuccess] = useState(false);
//   const [replyFail, setReplyFail] = useState(false);
//   const [votingLoading, setVotingLoading] = useState(false);
//   const [statusText, setStatusText] = useState("");
//   const openModal = () => setModalIsOpen(true);
//   const closeModal = () => setModalIsOpen(false);

//   const router = useRouter();
//   const { user } = useContext(AuthContext);

//   const userRank = rankCalc(comment.user_rank);
//   const rankColor = rankColors(comment.user_rank);

//   const countColor = totalVotes > 0 ? "text-green-500" : totalVotes < 0 ? "text-red-500" : "text-gray-500";

//   const handleReplyClick = () => setShowReply(!showReply);

//   const handleReplyChange = e => setReplyContent(e.target.value);

//   const handleCancel = () => {
//     setShowReply(false);
//     setReplyContent("");
//   };

//   const handleReplySubmit = () => {
//     handleReply({
//       comment,
//       user,
//       replyContent,
//       setLoading,
//       setReplyContent,
//       setShowReply,
//       setReplySuccess,
//       addComment,
//       setReplyFail,
//       setStatusText,
//       setComments
//     });
//   };

//   // Sanitize the HTML content
//   const sanitizedContent = sanitizeHtml(comment.comment_content, {
//     allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
//     allowedAttributes: {
//       ...sanitizeHtml.defaults.allowedAttributes,
//       img: ["src", "alt"]
//     }
//   });

//   console.log("COMMENT", comment);

//   return (
//     <section className="mb-10">
//       <div className={`p-2 mb-2 rounded-md flex items-center border-2 border-slate-100 ${depthColor}`}>
//         <div className="w-12 h-12 p-1 border rounded-full self-start">
//           <Image src={comment.comment_author_avatar} alt={comment.comment_author} height={40} width={40} className="rounded-full w-10 h-10" />
//         </div>
//         <div className="ml-2 flex flex-col justify-center w-full">
//           <div className="text-xs text-secondary600 py-1 px-1 ">
//             <BeansTimeAgo date={comment.comment_date} />
//           </div>

//           <div className="font-semibold border-b border-gray-300 pb-1 mb-2 flex items-center  px-1">
//             <div className="text-slate-500">{comment.comment_author}</div>
//             {userRank && <div>{userRank}</div>}
//           </div>
//           <div className="text-gray-600">{htmlParser(sanitizedContent)}</div>

//           <div className="flex items-center">
//             <div className="hover:cursor-pointer mr-2">
//               <FaAngleUp className={` ${userVote === "up" ? "text-primary500" : "text-gray-300"}`} onClick={() => handleVote("up")} disabled={votingLoading} />
//             </div>

//             <div className={`font-bold ${countColor}`}>{totalVotes}</div>

//             <div className="hover:cursor-pointer ml-2">
//               <FaAngleDown className={` ${userVote === "down" ? "text-primary500" : "text-gray-300"}`} onClick={() => handleVote("down")} disabled={votingLoading} />
//             </div>

//             {user ? (
//               <>
//                 {depth < 3 && (
//                   <div className="ml-4 hover:cursor-pointer flex items-center" onClick={handleReplyClick}>
//                     <FaReply className="text-primary500 mr-2" /> Reply
//                   </div>
//                 )}
//               </>
//             ) : (
//               <div className="ml-4 text-xs">
//                 <a onClick={() => router.push("/login")} className="font-semibold underline hover:cursor-pointer">
//                   Log In to Reply
//                 </a>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       <MyModal isOpen={modalIsOpen} onClose={closeModal}>
//         <h2 className="text-xl font-bold mb-4">Log In To Vote</h2>
//         <div>You must be logged in to register your vote.</div>
//         <div>Please log in or register today</div>

//         <div className="flex w-full justify-center mt-4">
//           <a onClick={() => router.push("/login")} className="btn hover:cursor-pointer">
//             Log In
//           </a>

//           <Link href="/bbjregister" className="btn-off ml-2">
//             Register
//           </Link>
//         </div>
//       </MyModal>

//       {showReply && (
//         <div className="ml-16 mb-4">
//           <div className="relative w-full border rounded-md border-gray-400 overflow-hidden p-2">
//             <textarea name="reply_comment" id={`reply_to_${comment.comment_ID}`} placeholder="Write your reply..." onChange={handleReplyChange} className="comment-reply"></textarea>
//             <div className="w-full flex justify-end bg-slate-100 rounded p-2">
//               <div className="btn-cancel hover:cursor-pointer" onClick={handleCancel}>
//                 Cancel
//               </div>
//               <div className="btn ml-2 hover:cursor-pointer" onClick={handleReplySubmit}>
//                 Post Reply
//               </div>
//             </div>
//           </div>
//           {loading && <Alert severity="info">Submitting Reply....</Alert>}
//           {replySuccess && <Alert severity="success">Reply submitted successfully!</Alert>}
//           {replyFail && <Alert severity="error">Failed to submit reply. {statusText}</Alert>}
//         </div>
//       )}
//       {comment.replies.length > 0 && (
//         <div className="ml-8">
//           {comment.replies.map(reply => (
//             <div className="mb-2" key={reply.comment_ID}>
//               <CommentCard comment={reply} depth={depth + 1} addComment={addComment} />
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default CommentCard;
