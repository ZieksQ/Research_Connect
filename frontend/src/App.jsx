import React from "react";
import {
  Route,
  Routes,
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
        <Route>
          {/* Main Site (uses RootRoute layout) */}
          <Route path="/" element={<RootRoute />}>
            <Route index element={<PostPage />} />

            {/* Profile section (inherits RootRoute) */}
            <Route path="profile" element={<ProfilePage />}>
              <Route index element={<Navigate to="posts" replace />} />
              <Route path="posts" element={<h1>Hello World!</h1>} />
              <Route path="about" element={<ProfileAboutPage />} />
            </Route>
          </Route>

          {/* Auth routes (no RootRoute layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Survey routes (no RootRoute layout) */}
          <Route path="/form" element={<SurveyRoute />}>
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
