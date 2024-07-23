import React from "react";
import { useRouter } from "next/router";
import BlogPost from "@/components/BlogPost";

const PageOrPost = ({ data, type }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (type === "post") {
    return <BlogPost content={data} />;
  }

  // Add fallback rendering for page type
  if (type === "page") {
    return <div dangerouslySetInnerHTML={{ __html: data.content.rendered }} />;
  }

  return <div>Type not recognized</div>;
};

export async function getStaticPaths() {
  const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

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
  const DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

  try {
    const postRes = await fetch(`${DOMAIN}/wp-json/bbj/v1/single_posts?slug=${params.slug}`);
    const pageRes = await fetch(`${DOMAIN}/wp-json/wp/v2/pages?slug=${params.slug}`);

    if (!postRes.ok && !pageRes.ok) {
      return {
        notFound: true
      };
    }

    const postData = (await postRes.json())[0] || null;
    const pageData = (await pageRes.json())[0] || null;

    const data = postData || pageData;
    const type = postData ? "post" : "page";

    if (!data) {
      return {
        notFound: true
      };
    }

    return {
      props: {
        data,
        type
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
