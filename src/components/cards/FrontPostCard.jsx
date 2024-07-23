import React from "react";
import Image from "next/image";
import BeansTimeAgo from "@/components/utils/TimeAgo";
import Link from "next/link";
import { commentConversion } from "@/utils/commentFormat";

const FrontPostCard = ({ post }) => {
  return (
    <article className="flex border-b flex-col md:flex-row border-slate-500 mb-4 pb-4 h-[150px]">
      <div className="w-full h-full relative md:w-[250px] md:h-[150px]">
        <div className="absolute z-50 top-1 left-1 bg-secondary500 py-1 px-2 text-xs rounded-md opacity-85">{post.category_link && <Link href={post.category_link}>{post.category}</Link>}</div>
        {post.slug && (
          <Link href={post.slug}>
            <div className="relative w-full h-[250px] md:w-[250px] md:h-[150px]">
              <Image src={post?.thumbnail_url} alt={post.post_title} fill className="rounded-md object-cover" sizes="(min-width: 768px) 250px, 100vw" />
            </div>
          </Link>
        )}
      </div>

      <div className="w-full px-2 flex flex-col  h-[150px] flex-grow">
        <div className="flex justify-between font-ibm text-sm text-gray-500">
          <div className="text-left grow">{post.author_name}</div>

          <div className="text-right grow">{post.post_modified !== post.post_date ? <BeansTimeAgo date={post.post_modified} /> : <BeansTimeAgo date={post.post_date} />}</div>
        </div>

        <div className="font-primaryHeader text-2xl">{post.slug ? <Link href={post.slug}>{post.post_title}</Link> : <span>{post.post_title}</span>}</div>
        <div className="text-sm flex-grow">{post.post_excerpt}</div>

        <div className="flex justify-between font-ibm text-sm text-gray-500">
          <div className="text-left">{post?.author?.node?.name}</div>
          <div className="text-right">{commentConversion(post.comment_count)}</div>
        </div>
      </div>
    </article>
  );
};

export default FrontPostCard;
