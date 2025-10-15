import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import PostPage from "./pages/PostPage.jsx";
import LoginPage from "./pages/user/LoginPage.jsx";
import RootRoute from "./routes/RootRoute.jsx";
import SurveyRoute from "./routes/SurveyRoute.jsx";
import SurveyPage from "./pages/SurveyPage.jsx";
import CreateFormPage from "./pages/CreateFormPage.jsx";
import SignupPage from "./pages/user/SignupPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import ProfileAboutPage from "./pages/profile/ProfileAboutPage.jsx";

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
            {/* Profile Page Path */}
            <Route path="profile" element={<ProfilePage />} >
              <Route index element={<Navigate to='posts' replace />} />
              <Route path="posts" element={<h1>Hello World!</h1>} />
              <Route path="about" element={<ProfileAboutPage />} />
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
