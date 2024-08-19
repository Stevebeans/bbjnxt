// src/pages/index.jsx

import React from "react";
import Divider from "@/components/Divider";
import PageHeader from "@/components/utils/PageHeader";
import { globalVariables } from "@/utils/globalVars";
import MainPostCard from "@/components/cards/MainPost";
import FeedUpdates from "@/components/FeedUpdates";
import FrontPosts from "@/components/FrontPosts";

const HomePage = ({ postsData, feedUpdatesData }) => {
  //console.log("POSTS DATA", postsData);
  const first_post = postsData.posts[0];
  const remaining_posts = postsData.posts.slice(1);

  //console.log("postsData", postsData);
  return (
    <React.Fragment>
      <section className="p-2">
        <PageHeader text={`${globalVariables.currentSeason} Spoilers`} />
      </section>

      {/* Top Post */}
      <MainPostCard first_post={first_post} />
      <Divider />
      <FeedUpdates fallbackData={feedUpdatesData} />
      <Divider />
      <FrontPosts posts={remaining_posts} />
    </React.Fragment>
  );
};

export const getStaticProps = async () => {
  const POST_URL = process.env.NEXT_PUBLIC_API_URL_BBJ + "/blog_posts?per_page=10";
  const FEED_URL = process.env.NEXT_PUBLIC_API_URL_BBJ + "/feed_updates?per_page=20";

  console.log("POST_URL", POST_URL);

  const posts = await fetch(POST_URL);
  const postsData = await posts.json();

  const feedUpdates = await fetch(FEED_URL);
  const feedUpdatesData = await feedUpdates.json();

  return {
    props: {
      postsData,
      feedUpdatesData
    },
    revalidate: 60
  };
};

export default HomePage;
