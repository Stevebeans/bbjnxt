import React, { useRef, Suspense } from "react";
import Image from "next/image";
import { commentConversion } from "@/utils/commentFormat";
import Link from "next/link";
import BeansTimeAgo from "@/components/utils/TimeAgo";
import PageHeader from "@/components/utils/PageHeader";
import parse from "html-react-parser";
import Comments from "@/components/Comments";
import { FaArrowDown } from "react-icons/fa";

const BlogPost = ({ content }) => {
  //console.log("content", content);
  // decode header text

  const commentsRef = useRef(null);

  const scrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <article>
      <div className="relative">
        <Image src={content.page_header} alt={content.post_title} priority={true} width={800} height={400} sizes="(min-width: 768px) 1210px, 500px" className="md:rounded-t-lg object-cover w-full mx-auto responsive-image h-[400px]" />
        <div className="absolute bottom-0 left-0 py-2 px-2 bg-gray-800 bg-opacity-75 text-white rounded-r-lg">
          <div className="text-white">
            <h1 className="font-primaryHeader text-3xl">{content.post_title}</h1>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-primary600 to-primary400 text-white py-1 px-2 flex justify-between items-center">
        <div>
          <BeansTimeAgo date={content.post_modified} />
        </div>
        <div>{commentConversion(content.comment_count)}</div>
        <div className="flex cursor-pointer self-center text-secondary300" onClick={scrollToComments}>
          Jump to Comments <FaArrowDown className="self-center ml-2" />
        </div>
      </div>
      <div className="border-b border-slate-300 px-2 py-1 flex">
        <div>Author:</div>
        <div className="ml-2">
          <Image src={content.author_avatar} width={0} height={0} alt={content.author_name} className=" h-6 w-6 rounded-full" />
        </div>
        <div className="ml-1">{content.author_name}</div>
      </div>

      <div className="prose max-w-none p-4">{parse(content.post_content)}</div>
      <div ref={commentsRef}>
        <Suspense fallback={<div>Loading...</div>}>
          <Comments content={content} />
        </Suspense>
      </div>

      {/* 
      <div className="p-2 border-b border-slate-400 mb-4">
        <PageHeader text={content.post_title} />
        <div className="flex justify-between pb-2 font-ibm text-gray-400">
          <div>{content.author_name}</div>
          <div>
            <BeansTimeAgo date={content.post_modified} />
          </div>
        </div>

        

        <div className="prose max-w-none">{parse(content.content)}</div>

        
      </div> */}
    </article>
  );
};

export default BlogPost;
