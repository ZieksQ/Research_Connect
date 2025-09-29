import React from "react";
import {Routes, Route} from 'react-router-dom'
import HomePage from "./pages/HomePage.jsx";
import PostCard from "./components/PostCard.jsx";
import SamplePostCard from "./components/Sample.jsx";
import PostPage from "./pages/PostPage.jsx";
import Navbar from "./components/Navbar.jsx";
import LoginPage from "./pages/LoginPage.jsx";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route index element={<LoginPage />}/>
        <Route path="/home" element={<PostPage />}/>
      </Routes>
    </>
  );
};

export default App;
