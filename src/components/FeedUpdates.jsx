import React from "react";
import SubHeader from "@/components/utils/SubHeader";
import FeedUpdate from "@/components/cards/FeedUpdates";
import { fetcher } from "@/utils/fetcher";
import { feedUpdateGetURL } from "@/utils/fetchURLs";
import { mainPageUpdates } from "@/utils/globalVars";
import useSWR from "swr";

const FeedUpdates = ({ fallbackData }) => {
  const FEED_URL = feedUpdateGetURL(mainPageUpdates);

  console.log("FEED URL", FEED_URL);

  const { data: feed_updates } = useSWR(FEED_URL, fetcher, {
    fallbackData: fallbackData,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0
  });

  console.log("DATA", feed_updates);

  return (
    <section id="next-feed-updates" className=" p-2">
      <SubHeader title="Feed Updates" />
      <div className="w-full flex flex-col">
        {feed_updates.feed_updates.map((update, index) => (
          <FeedUpdate update={update} key={update.ID} />
        ))}
      </div>
    </section>
  );
};

export default FeedUpdates;
