import React, { useRef, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import BeansTimeAgo from "./utils/TimeAgo";
import PageHeader from "./utils/PageHeader";
import parse from "html-react-parser";
import Comments from "./Comments";
import { FaArrowDown } from "react-icons/fa";

const BlogPost = ({ content }) => {
  // decode header text

  const commentsRef = useRef(null);

  const scrollToComments = () => {
    if (commentsRef.current) {
      commentsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <article>
      <div>
        <Image src={content.thumbnail_url} alt={content.post_title} priority={true} width={800} height={400} sizes="(min-width: 768px) 1210px, 500px" className="md:rounded-md object-cover w-full mx-auto responsive-image" />
      </div>
      <div className="p-2 border-b border-slate-400 mb-4">
        <PageHeader text={content.post_title} />
        <div className="flex justify-between pb-2 font-ibm text-gray-400">
          <div>{content.author_name}</div>
          <div>
            <BeansTimeAgo date={content.post_modified} />
          </div>
        </div>

        <div className="text-center">
          {content.comment_count > 0 ? (
            <div className="flex justify-center">
              {content.comment_count} Comments -{" "}
              <span onClick={scrollToComments} className="cursor-pointer text-blue-500">
                Jump to Comments <FaArrowDown />
              </span>
            </div>
          ) : (
            <div className="flex justify-center">
              0 Comments - Be The First!{" "}
              <span onClick={scrollToComments} className="cursor-pointer text-blue-500">
                <FaArrowDown />
              </span>
            </div>
          )}
        </div>

        <div className="prose max-w-none">{parse(content.content)}</div>

        <div ref={commentsRef}>
          <Suspense fallback={<div>Loading...</div>}>
            <Comments />
          </Suspense>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
