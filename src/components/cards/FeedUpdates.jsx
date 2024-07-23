import React from "react";
import Image from "next/image";
import Link from "next/link";
import BeansTimeAgo from "@/components/utils/TimeAgo";
import VotingBox from "../VotingBox";

const FeedUpdate = ({ update }) => {
  const date = new Date(update.post_modified);

  return (
    <div className="p-1  border-sky-600 hover:bg-slate-200 border flex rounded-md  relative mb-4">
      <VotingBox />
      <div className="w-full flex flex-col">
        <div className="bg-gray-200 p-1 flex justify-between ">
          <div className="font-ibm text-sm flex-shrink-0 flex min-w-fit items-center">
            {update.author_name} <span className="font-ibm ml-2 text-xs">{date && <BeansTimeAgo date={date} locale="en-US" />}</span>
          </div>
        </div>

        <div className="flex-col p-2">
          <div className="row-span-2 float-left mr-2">
            {update?.thumbnail_url && update?.page_slug && (
              <Link href={update?.page_slug}>
                <Image src={update?.thumbnail_url} alt={update.title} className="h-[100px] w-[100px] rounded" width={100} height={100} />
              </Link>
            )}
          </div>
          <div className="text-lg font-semibold">{update?.page_slug ? <Link href={update?.page_slug}>{update.post_title}</Link> : update.post_title}</div>
        </div>
      </div>
    </div>
  );
};

export default FeedUpdate;
