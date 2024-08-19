// this is where I will get all the fetch URLS

const DOMAIN = process.env.NEXT_PUBLIC_API_URL_V3;
const DOMAIN_V1 = process.env.NEXT_PUBLIC_API_URL_BBJ;
const LIVE_URL = process.env.NEXT_PUBLIC_API_LIVE;

// Comments
export const getFetchCommentsURL = (post_ID, per_page) => {
  return `${DOMAIN}/pull_comments?post_id=${post_ID}&per_page=${per_page || 40}`;
};

export const getCommentVotesURL = comment_ID => {
  return `${DOMAIN}/pull_comment_vote?comment_id=${comment_ID}`;
};

export const feedUpdateGetURL = per_page => {
  return `${LIVE_URL}/feed_updates?per_page=${per_page || 20}`;
};
