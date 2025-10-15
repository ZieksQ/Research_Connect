import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard.jsx";
import CardPost from "../components/post/CardPost.jsx";
import CreateNewSurveyPage from "./home/CreateNewSurveyPage.jsx";

// This is where we fetch post
// !TODO: Fetch data from the Backend/Database
const PostPage = () => {
  const [posts, setPosts] = useState([]);

  // Fetch Data From Database
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/survey/post/get", {
          credentials: "include", // ALWAYS REMEMBER TO ADD CREDENTIALS WHEN FETCHING TO ADD COOKIES
        });
        const data = await res.json();

        // if data is not ok send error msg
        if (!data.ok) {
          return <h1>data.msg</h1>;
        }

        setPosts(data.message || []); // ADD DATA TO POSTS
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    }

    fetchPosts();

  }, []);

  return (
    <section className="container-center mt-6 mb-20 flex flex-col gap-4">
      <CreateNewSurveyPage />
      {posts.map((e, index) => (
        <CardPost key={index} Title={e.title} Description={e.content} />
      ))}
    </section>
  );
};

export default PostPage;
