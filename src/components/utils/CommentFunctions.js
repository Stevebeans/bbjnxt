// comment functions
import Cookies from "js-cookie";
import useSWR, { mutate } from "swr";
import axios from "axios";
import { COMMENT_COUNT } from "./constants";
import DOMPurify from "dompurify";
import he from "he";
import htmlParser from "html-react-parser";
import sanitizeHtml from "sanitize-html";

export const handleReply = async (e, replyContent, user, post_ID, setIsPosting, setIsSuccess, setIsFail, setErrorMessage, isReply, setShowReply, parentCommentID = 0) => {
  e.preventDefault();

  //console.log("parentCommentID", parentCommentID);
  //handleReply(e, replyContent, user, post_ID, setNewComment, comments, setCommentPosting, setIsPosting, setIsSuccess, setIsFail, setErrorMessage, isReply, parentCommentID);
  const token = Cookies.get("token");
  const POST_URL = `${process.env.NEXT_PUBLIC_API_V2}/comments`;

  try {
    setIsPosting(true);

    const response = await axios.post(
      POST_URL,
      {
        post: post_ID,
        content: replyContent,
        author: user.user_id,
        author_name: user.user_display_name,
        author_email: user.user_email,
        parent: parentCommentID,
        date: new Date().toISOString()
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 201) {
      // Optimistically update the comments
      //setNewComment([response.data, ...comments]);
      setIsPosting(false);

      // set is success for 3 seconds
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setShowReply(false);
      }, 3000);

      // Trigger a revalidation (refetch) of SWR
      mutate(`${process.env.NEXT_PUBLIC_API_URL_BBJ}/bbj_comments?post_id=${post_ID}&per_page=${COMMENT_COUNT}`);
    }
  } catch (error) {
    console.error("Error posting comment:", error);
    //console.log("error", error.response.data.message);
    setIsPosting(false);
    setIsFail(true);
    setErrorMessage(SantizeAndDecode(error.response.data.message));
    setTimeout(() => {
      setIsFail(false);
      setShowReply(false);
    }, 3000);
  } finally {
    e.target.reset();
  }
};

export const SantizeAndDecode = content => {
  const decoded = he.decode(content);
  const sanitized = DOMPurify.sanitize(decoded);
  return sanitized;
};

export const sanitizeContent = content => {
  return sanitizeHtml(content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt"]
    }
  });
};
