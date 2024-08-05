export const COMMENT_COUNT = 40;

export const getFetchCommentsURL = post_ID => {
  return `${process.env.NEXT_PUBLIC_API_URL_BBJ}/bbj_comments?post_id=${post_ID}&per_page=${COMMENT_COUNT}`;
};
