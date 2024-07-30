// utils/handleReply.js

import axios from "axios";
import Cookies from "js-cookie";

export const handleReply = async ({ comment, user, replyContent, setLoading, setReplyContent, setShowReply, setReplySuccess }) => {
  const POST_URL = process.env.NEXT_PUBLIC_API_V2 + "/comments";

  const post_ID = comment.post_ID;
  const comment_ID = comment.comment_ID;
  const user_ID = user.data.user.id;
  const comment_content = replyContent;

  const parent_ID = comment_ID;

  if (!user) {
    console.error("User is not logged in");
    return;
  }

  const token = Cookies.get("token");

  if (!comment_content) {
    console.error("Comment content is empty");
    return;
  }

  setLoading(true);

  // make it EST timezone
  const commentDate = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

  try {
    const response = await axios.post(
      POST_URL,
      {
        post: post_ID,
        parent: parent_ID,
        content: comment_content,
        author_name: user.user_display_name,
        author_email: user.user_email,
        author: user_ID,
        date: commentDate
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 201) {
      setLoading(false);
      setReplyContent("");
      setShowReply(false);
      setReplySuccess(true);

      setTimeout(() => {
        setReplySuccess(false);
      }, 3000);
    }
  } catch (error) {
    console.error("Error submitting reply:", error);
    setLoading(false);
  }
};
