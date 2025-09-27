import React from "react";
import HomePage from "./pages/HomePage.jsx";
import PostCard from "./components/PostCard.jsx";
import SamplePostCard from "./components/Sample.jsx";
import PostPage from "./pages/PostPage.jsx";
import Navbar from "./components/Navbar.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <PostPage />
    </>
  );
};

export default App;
