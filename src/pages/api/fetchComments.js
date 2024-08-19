import axios from "axios";

export const fetchComments = async (postId, URL) => {
  try {
    const res = await axios.get(URL);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};
