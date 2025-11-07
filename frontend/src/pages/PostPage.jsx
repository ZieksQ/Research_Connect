import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard.jsx";
import CardPost from "../components/post/CardPost.jsx";
import CreateNewSurveyPage from "./home/CreateNewSurveyPage.jsx";
import MySurveysListPage from "./home/MySurveysListPage.jsx";
import TopOrganizationsPage from "./home/TopOrganizationsPage.jsx";

// This is where we fetch post
// !TODO: Fetch data from the Backend/Database
const PostPage = () => {
  const [posts, setPosts] = useState([]);

  // Fetch Data From Database
  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/survey/post/get", {
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
    <section className=" mb-24 grid gap-4 md:grid-cols-12 md:grid-rows-6 px-3 lg:px-10">
  {/* Left Sidebar */}
  <aside
    className="hidden md:flex flex-col gap-4 md:col-span-3 lg:row-span-6 
               border-r border-gray-200 pr-4"
  >
    <MySurveysListPage />
    <TopOrganizationsPage />
  </aside>

  {/* Main Feed */}
  <main
    className="md:col-start-4 md:col-span-9 lg:col-span-6 row-span-6 lg:col-start-4
               border-x border-gray-200 bg-white"
  >

    <div className="p-5 border-b border-gray-200">
      <CreateNewSurveyPage />
    </div>

    <div className="flex flex-col">
      {posts.map((e, index) => (
        <div
          key={index}
          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <CardPost Title={e.title} Description={e.content} />
        </div>
      ))}
    </div>
  </main>

  {/* Right Sidebar */}
  <aside
    className="hidden lg:flex flex-col gap-4 lg:col-span-3 lg:row-span-6 lg:col-start-10 
               border-l border-gray-200 pl-4"
  >
    <MySurveysListPage />
  </aside>
</section>

  );
};

export default PostPage;
