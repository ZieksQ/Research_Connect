import React from "react";
import PostCard from "../components/PostCard.jsx";

// This is where we fetch post
// !TODO: Fetch data from the Backend/Database
const PostPage = () => {
  return (
    <section className="container-center mt-6 mb-20 flex flex-col gap-4">
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
      <PostCard />
    </section>
  );
};

export default PostPage;
