import React from "react";
import SubHeader from "@/components/utils/Divider";
import FrontPostCard from "@/components/cards/FrontPostCard";
import { FaChevronRight } from "react-icons/fa6";

const FrontPosts = ({ posts }) => {
  //console.log("FrontPosts  posts", posts);
  return (
    <section>
      <div className="w-full flex flex-col my-10 p-2">
        <SubHeader title="Latest Posts" />

        <div className="w-full flex justify-between">
          <div className="btn mb-2">
            View All Posts <FaChevronRight />
          </div>
        </div>
        <div>
          {posts.map(post => (
            <FrontPostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="w-full flex justify-between">
          <div className="btn mb-2">
            View All Posts <FaChevronRight />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrontPosts;
