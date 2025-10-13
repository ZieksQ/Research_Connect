import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import PostPage from "./pages/PostPage.jsx";
import LoginPage from "./pages/user/LoginPage.jsx";
import RootRoute from "./routes/RootRoute.jsx";
import SurveyRoute from "./routes/SurveyRoute.jsx";
import SurveyPage from "./pages/SurveyPage.jsx";
import CreateFormPage from "./pages/CreateFormPage.jsx";
import SignupPage from "./pages/user/SignupPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Root Path */}
        <Route path="/">
          {/* Register User Path */}
          <Route index element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          {/* Home Path */}
          <Route path="home" element={<RootRoute />}>
            <Route index element={<PostPage />} />
            <Route path="profile" element={<ProfilePage />} >
              <Route index element={<h1>Hello World!</h1>} />
              <Route path="my-survey" element={<h1>Hello World!</h1>} />
              <Route path="user-info" element={<h1>User Information</h1>} />
            </Route>
          </Route>
          {/* Survey Path */}
          <Route path="form" element={<SurveyRoute />}>
            <Route path="response" element={<SurveyPage />} />
            <Route path="new" element={<CreateFormPage />} />
          </Route>
        </Route>
      </>,
    ),
  );

  return (
    <div data-theme="light" className="h-full min-h-[100vh] pb-8">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
