"use client";

// import SubHeader from "@/components/utils/SubHeader";
import AuthContext from "@/utils/AuthContext";
import { redirectToLogin } from "@/utils/navigation";
import { useRouter } from "next/router";
import CommentCard from "@/components/cards/Comment";

import { useState, useContext, use, useEffect } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/fetcher";
import { COMMENT_COUNT } from "./utils/constants";
import PostComment from "./cards/PostComment";

const Comments = ({ content }) => {
  const post_ID = content.ID;
  const FETCH_URL = `${process.env.NEXT_PUBLIC_API_URL_BBJ}/bbj_comments?post_id=${post_ID}&per_page=${COMMENT_COUNT}`;
  const [comments, setComments] = useState([]);
  const [commentPosting, setCommentPosting] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const { data, error, mutute } = useSWR(FETCH_URL, fetcher, {
    refreshInterval: 10000000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 500
  });

  useEffect(() => {
    if (commentPosting) {
      mutate(FETCH_URL);
      setCommentPosting(false);
    }
  }, [commentPosting]);

  useEffect(() => {
    if (data) {
      // set comments with newest to oldest
      setComments(data.reverse());
    }
    if (error) {
      console.error("Error fetching comments:", error);
    }
  }, [data, error]);

  // console.log("comments", comments);

  return (
    <div>
      <PostComment user={user} setNewComment={setComments} post_ID={post_ID} comments={comments} setCommentPosting={setCommentPosting} commentPosting={commentPosting} />

      {comments.map(comment => (
        <CommentCard key={comment.comment_ID} comment={comment} setNewComment={setComments} />
      ))}
    </div>
  );
};

export default Comments;

// const Comments = ({ comments: initialComments, comment_count }) => {
//   console.log("initial comments", initialComments);
//   const [comments, setComments] = useState(initialComments);
//   const [sortOrder, setSortOrder] = useState("newest");
//   const { user } = useContext(AuthContext);
//   const router = useRouter();

//   const addComment = newComment => {
//     setComments(prevComments => [...prevComments, newComment]);
//   };

//   const handleSortChange = e => {
//     setSortOrder(e.target.value);
//   };

//   const sortedComments = [...comments].sort((a, b) => {
//     if (sortOrder === "newest") {
//       return new Date(b.comment_date) - new Date(a.comment_date);
//     } else if (sortOrder === "oldest") {
//       return new Date(a.comment_date) - new Date(b.comment_date);
//     } else if (sortOrder === "popular") {
//       return b.comment_likes - a.comment_likes;
//     } else if (sortOrder === "least") {
//       return a.comment_likes - b.comment_likes;
//     }
//   });

//   if (!comments.length) {
//     return <p>No comments yet. Be the first to comment!</p>;
//   }

//   console.log("COMMENTS", comments);

//   return (
//     <section className="p-2">
//       <div className="flex justify-between items-center mb-4 border-b border-primary400">
//         <div>
//           <SubHeader title={`${comment_count} Comments`} />
//         </div>
//         <div>
//           <label htmlFor="sortOrder" className="mr-2">
//             Sort by:
//           </label>
//           <select id="sortOrder" value={sortOrder} onChange={handleSortChange} className="border p-1 rounded">
//             <option value="newest">Newest</option>
//             <option value="oldest">Oldest</option>
//             <option value="popular">Most Popular</option>
//             <option value="least">Least Popular</option>
//           </select>
//         </div>
//       </div>

//       <div className="">
//         {user ? (
//           <div>Post</div>
//         ) : (
//           <div className="flex items-center justify-center">
//             <p className="text-sm">
//               Please{" "}
//               <a onClick={() => redirectToLogin(router)} className="hover:cursor-pointer text-primary400 underline font-semibold">
//                 Log In
//               </a>{" "}
//               to post a comment
//             </p>
//           </div>
//         )}
//       </div>

//       {sortedComments.map(comment => (
//         <CommentCard comment={comment} addComment={addComment} key={comment.comment_ID} setComments={setComments} />
//       ))}
//     </section>
//   );
// };

// export default Comments;
