import React from "react";
import SubHeader from "@/components/utils/SubHeader";
import FeedUpdate from "./cards/FeedUpdates";

const FeedUpdates = ({ feed_updates }) => {
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
