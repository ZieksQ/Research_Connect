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
import RootRoute from "./layout/RootLayout.jsx";
import SurveyRoute from "./layout/SurveyLayout.jsx";
import SurveyPage from "./pages/survey/survey_respondent/SurveyPage.jsx";
import SignupPage from "./pages/user/SignupPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import ProfileAboutPage from "./pages/profile/ProfileAboutPage.jsx";
import LandingPage from "./pages/landingPage/landingPage.jsx";
import SurveyBuilder from "./pages/survey/survey_builder/SurveyWizard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import RootLayout from "./layout/RootLayout.jsx";
import HomePage from "./pages/home/HomePage.jsx";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Root Path */}
        <Route path="/">
          {/* Register User Path */}
          <Route index element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />


          {/* Home Path */}
          <Route path="home" element={<RootRoute />}>
            <Route index element={<PostPage />} />

            <Route path="feed" element={<HomePage />}/>
            {/* Profile section (inherits RootRoute) */}
            <Route path="profile" element={<ProfilePage />}>
              <Route index element={<Navigate to="posts" replace />} />
              <Route path="posts" element={<h1>Hello World!</h1>} />
              <Route path="about" element={<ProfileAboutPage />} />
            </Route>
          </Route>

          {/* Auth routes (no RootRoute layout) */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* Survey routes (no RootRoute layout) */}
          <Route path="form" element={<SurveyRoute />}>
            <Route path="response" element={<SurveyPage />} />
            <Route path="new" element={<SurveyBuilder />} />
          </Route>

          {/* Admin routes */}
          <Route path="admin" element={<RootLayout />}>
            <Route index element={<AdminDashboard />}/>
          </Route>
        </Route>
      </>,
    ),
  );

  return (
    <div data-theme="light" className="min-h-screen">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
