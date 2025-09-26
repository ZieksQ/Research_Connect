import React from "react";
import HomePage from "./pages/HomePage.jsx";
import PostCard from "./components/PostCard.jsx";
import SamplePostCard from "./components/Sample.jsx";

const App = () => {
  return (
    <>
      <HomePage />
      <PostCard />
      <SamplePostCard />
    </>
  );
};

export default App;
