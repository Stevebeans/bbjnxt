// utils/fetcher.js
export const fetcher = url => fetch(url).then(res => res.json());
export const fetchNoCache = url => fetch(url, { cache: "no-cache" }).then(res => res.json());
