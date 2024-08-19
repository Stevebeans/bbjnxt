import React from "react";
import { useRouter } from "next/router";
import BlogPost from "@/components/BlogPost";

const PageOrPost = ({ data, type, comments }) => {
  const router = useRouter();

  const comment_count = data ? data.comment_count : 0;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  //<BlogPost content={data} comments={comments} comment_count={comment_count} />

  if (type === "post") {
    return <BlogPost content={data} />;
  }

  // Add fallback rendering for page type
  if (type === "page") {
    return "PAGE";
  }

  return <div>Type not recognized</div>;
};

export async function getStaticPaths() {
  const DOMAIN = process.env.NEXT_PUBLIC_API_URL_BBJ;

  try {
    const postsRes = await fetch(`${DOMAIN}/wp-json/bbj/v1/single_posts`);
    const pagesRes = await fetch(`${DOMAIN}/wp-json/wp/v2/pages`);

    if (!postsRes.ok || !pagesRes.ok) {
      console.error("Failed to fetch posts or pages:", postsRes.statusText, pagesRes.statusText);
      return { paths: [], fallback: true };
    }

    const posts = await postsRes.json();
    const pages = await pagesRes.json();

    const reservedPaths = ["/login"];

    const paths = [...posts.map(post => ({ params: { slug: post.slug } })).filter(path => !reservedPaths.includes(`/${path.params.slug}`)), ...pages.map(page => ({ params: { slug: page.slug } })).filter(path => !reservedPaths.includes(`/${path.params.slug}`))];

    console.log("Paths", paths);

    return {
      paths,
      fallback: true
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return { paths: [], fallback: true };
  }
}

export async function getStaticProps({ params }) {
  const DOMAIN = process.env.NEXT_PUBLIC_API_URL_BBJ;
  const PAGE_URL = `${DOMAIN}/single_page?slug=${params.slug}`;

  try {
    const res = await fetch(PAGE_URL);
    const data = (await res.json())[0] || null;

    if (!res.ok || !data) {
      return {
        notFound: true
      };
    }

    const post_ID = data.ID || null;
    let comments = [];

    if (post_ID) {
      const COMMENT_API = `${DOMAIN}/bbj_comments?post_id=${post_ID}&per_page=40`;
      const commentRes = await fetch(COMMENT_API);
      comments = commentRes.ok ? await commentRes.json() : [];
    }

    const type = data.next_post_type === "post" ? "post" : "page";

    return {
      props: {
        data,
        type,
        comments
      },
      revalidate: 10
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      notFound: true
    };
  }
}

export default PageOrPost;
