import { useState } from "react";
import { useLoaderData } from "react-router-dom";

import SingleCard from "../card/SingleCard";
import Alert from "react-bootstrap/Alert";

const Cards = () => {
  const { categories, originalPosts } = useLoaderData();
  const [posts, setPosts] = useState(originalPosts);

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
  };

  return (
    <div className="p-10">
      {posts.length === 0 && (
        <Alert variant="warning" className="w-max mx-auto">
          There are no posts now!
        </Alert>
      )}
      {posts.length > 0 && (
        <div className=" max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 place-items-center">
          {posts.map((post) => (
            <div key={post.id}>
              <SingleCard
                post={post}
                categories={categories}
                onDelete={handleDeletePost}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cards;
