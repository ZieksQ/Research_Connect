import React, { useEffect, useState } from "react";
import PostCard from "../components/PostCard.jsx";
import CardPost from "../components/post/CardPost.jsx";
import CreateNewSurveyPage from "./home/CreateNewSurveyPage.jsx";
import MySurveysListPage from "./home/MySurveysListPage.jsx";
import TopOrganizationsPage from "./home/TopOrganizationsPage.jsx";

// This is where we fetch post
// !TODO: Fetch data from the Backend/Database
// ! This is working but temporary
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
    <section className="mb-24 grid gap-4 px-3 md:grid-cols-12 md:grid-rows-6 lg:px-10">
      {/* Left Sidebar */}
      <aside className="hidden flex-col gap-4 border-r border-gray-200 pr-4 md:col-span-3 md:flex lg:row-span-6">
        <MySurveysListPage />
        <TopOrganizationsPage />
      </aside>

      {/* Main Feed */}
      <main className="row-span-6 border-x border-gray-200 bg-white md:col-span-9 md:col-start-4 lg:col-span-6 lg:col-start-4">
        <div className="border-b border-gray-200 p-5">
          <CreateNewSurveyPage />
        </div>

        <div className="flex flex-col">
          {posts.map((e, index) => (
            <div
              key={index}
              className="border-b border-gray-200 transition-colors hover:bg-gray-50"
            >
              <CardPost Title={e.title} Description={e.content} />
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="hidden flex-col gap-4 border-l border-gray-200 pl-4 lg:col-span-3 lg:col-start-10 lg:row-span-6 lg:flex">
        <MySurveysListPage />
      </aside>
    </section>
  );
};

export default PostPage;
