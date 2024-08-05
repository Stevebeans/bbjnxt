import axios from "axios";
import Cookies from "js-cookie";
import { decodeHtmlEntities } from "@/components/utils/utiliites";

export const handleReply = async ({ comment, user, replyContent, setLoading, setReplyContent, setShowReply, setReplySuccess, addComment, setReplyFail, setStatusText, setComments }) => {
  if (!user) {
    console.error("User is not logged in");
    return;
  }

  // handleReply(e, replyContent, user, post_ID, setNewComment, comments, setCommentPosting, setIsPosting, setIsSuccess, setIsFail, setErrorMessage, isReply, parentCommentID);

  const POST_URL = process.env.NEXT_PUBLIC_API_V2 + "/comments";

  const postId = comment.post_ID;
  const commentId = comment.comment_ID;
  const userId = user.user_id;
  const userName = user.user_display_name;
  const userEmail = user.user_email;
  const commentContent = replyContent;

  const parentId = commentId;

  if (!commentContent) {
    console.error("Comment content is empty");
    return;
  }

  const token = Cookies.get("token");
  if (!token) {
    console.error("Token is missing");
    return;
  }

  setLoading(true);

  // Make it EST timezone
  const commentDate = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const isoDate = new Date(commentDate).toISOString();

  try {
    const response = await axios.post(
      POST_URL,
      {
        post: postId,
        parent: parentId,
        content: commentContent,
        author_name: userName,
        author_email: userEmail,
        author: userId,
        date: isoDate
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    setLoading(false);

    console.log("response", response);

    // set the reply information and pass it to comments

    if (response.status === 201) {
      setReplySuccess(true);
      setTimeout(() => {
        setReplySuccess(false);
      }, 3000);
      // update comment state
      console.log("response data", response.data);
      const newComment = {
        ...response.data.content,
        comment_ID: response.data.id,
        post_ID: response.data.post,
        comment_author: userName,
        author_ID: userId,
        comment_author_avatar: user.avatar
      };

      setComments(comments => {
        // Find the parent comment and update its replies
        return comments.map(parentComment => {
          if (parentComment.comment_ID === parentId) {
            return {
              ...parentComment,
              replies: [...parentComment.replies, newComment]
            };
          }
          return parentComment;
        });
      });

      return newComment; // Return the new comment data
    } else {
      console.error("Error: Received status code", response.status);
    }
  } catch (error) {
    if (error.response) {
      setReplyFail(true);
      setTimeout(() => {
        setReplyFail(false);
      }, 3000);
      setStatusText(decodeHtmlEntities(error.response.data.message));

      // Server responded with a status other than 200 range
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // Request was made but no response received
      console.error("Request data:", error.request);
    } else {
      // Something else happened in setting up the request
      console.error("Error message:", error.message);
    }
    setLoading(false);
  }
};
