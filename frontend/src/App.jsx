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
import SurveyPage from "./pages/survey/survey_respondent/SurveyPage.jsx";
import SignupPage from "./pages/user/SignupPage.jsx";
import ProfilePage from "./pages/profile/ProfilePage.jsx";
import ProfileAboutPage from "./pages/profile/ProfileAboutPage.jsx";
import LandingPage from "./pages/landingPage/landingPage.jsx";
import SurveyBuilder from "./pages/survey/survey_builder/SurveyWizard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import HomePage from "./pages/home/HomePage.jsx";
import ProtectedLayout from "./layout/ProtectedLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import RootLayout from "./layout/RootLayout.jsx";
import Settings from "./components/settings/Settings.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";

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
          <Route element={<ProtectedLayout />}>
            <Route element={<RootLayout />}>
              <Route path="home">
                <Route index element={<PostPage />} />
                <Route path="feed" element={<HomePage />} />
                {/* Profile section (inherits RootRoute) */}
                <Route path="profile" element={<ProfilePage />}>
                  <Route index element={<Navigate to="posts" replace />} />
                  <Route path="posts" element={<h1>Hello World!</h1>} />
                  <Route path="about" element={<ProfileAboutPage />} />
                </Route>
              </Route>

              {/* Survey routes (no RootRoute layout) */}
              <Route path="form">
                <Route path="response" element={<SurveyPage />} />
                <Route path="new" element={<SurveyBuilder />} />
              </Route>
              {/* Settings */}
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Auth routes (no RootRoute layout) */}
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />

          {/* Admin routes */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>
      </>,
    ),
  );

  return (
    <AuthProvider>
      <div data-theme="light" className="min-h-screen bg-white">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  );
};

export default App;
