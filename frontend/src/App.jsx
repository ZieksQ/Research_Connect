import React, { lazy, Suspense } from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import {
  answerSurveyChecker,
  getSurvey,
} from "./services/survey/survey.service.js";
import { AuthProvider } from "./context/AuthProvider.jsx";

// Eagerly loaded - needed for initial render
import LandingPage from "./pages/landingPage/landingPage.jsx";
import LoginPage from "./pages/user/LoginPage.jsx";
import SignupPage from "./pages/user/SignupPage.jsx";
import ProtectedLayout from "./layout/ProtectedLayout.jsx";
import RootLayout from "./layout/RootLayout.jsx";
import PublicLayout from "./layout/PublicLayout.jsx";

// Lazy loaded components - loaded on demand
const SurveyPage = lazy(() => import("./pages/survey/survey_respondent/SurveyPage.jsx"));
const ProfilePage = lazy(() => import("./pages/profile/ProfilePage.jsx"));
const ProfileAboutPage = lazy(() => import("./pages/profile/ProfileAboutPage.jsx"));
const ProfilePostsPage = lazy(() => import("./pages/profile/ProfilePostsPage.jsx"));
const SurveyBuilder = lazy(() => import("./pages/survey/survey_builder/SurveyWizard.jsx"));
const SurveyResult = lazy(() => import("./pages/survey/survey-results/SurveyResult.jsx"));
const AdminRequest = lazy(() => import("./pages/admin/AdminRequest.jsx"));
const AdminReviewPosts = lazy(() => import("./pages/admin/AdminReviewPosts.jsx"));
const AdminGenerateCode = lazy(() => import("./pages/admin/AdminGenerateCode.jsx"));
const NotFoundPage = lazy(() => import("./pages/error/NotFoundPage.jsx"));
const AdminLayout = lazy(() => import("./layout/AdminLayout.jsx"));
const HomePage = lazy(() => import("./pages/home/HomePage.jsx"));
const ArchivedPage = lazy(() => import("./pages/home/ArchivedPage.jsx"));
const RejectedPage = lazy(() => import("./pages/home/RejectedPage.jsx"));
const LikedPostsPage = lazy(() => import("./pages/profile/LikedPostsPage.jsx"));
const Settings = lazy(() => import("./components/settings/Settings.jsx"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-background">
    <span className="loading loading-infinity loading-lg text-custom-blue"></span>
    <p className="mt-4 font-giaza text-xl text-custom-maroon animate-pulse">Loading Research Connect...</p>
  </div>
);

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Root Path */}
        <Route path="/">
          {/* Public routes - redirect to /home if logged in */}
          <Route element={<PublicLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
          </Route>

          {/* Home Path */}
          <Route element={<ProtectedLayout />}>
            <Route element={<RootLayout />}>
              <Route path="home">
                <Route index element={<HomePage />} />
              </Route>

              {/* Archived and Rejected routes */}
              <Route path="archived" element={<ArchivedPage />} />
              <Route path="rejected" element={<RejectedPage />} />

              {/* Profile section (inherits RootRoute) */}
              <Route path="profile" element={<ProfilePage />}>
                <Route index element={<Navigate to="posts" replace />} />
                <Route path="posts" element={<ProfilePostsPage />} />
                <Route path="liked" element={<LikedPostsPage />} />
                <Route path="about" element={<ProfileAboutPage />} />
              </Route>

              {/* Survey routes (no RootRoute layout) */}
              <Route path="form">
                <Route
                  path="response/:id"
                  element={<SurveyPage />}
                  loader={async ({ params }) => {
                    const [answerCheck, surveyData] = await Promise.all([
                      answerSurveyChecker(params.id),
                      getSurvey(params.id),
                    ]);
                    return { answerCheck, surveyData };
                  }}
                />
                <Route path="new" element={<SurveyBuilder />} />
                <Route path="result/:id" element={<SurveyResult />} />
              </Route>
              {/* Settings */}
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="request" replace />} />
            <Route path="request" element={<AdminRequest />} />
            <Route path="request/review/:id" element={<AdminReviewPosts />} />
            <Route path="generate-code" element={<AdminGenerateCode />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </>,
    ),
  );

  return (
    <AuthProvider>
      <div data-theme="light" className="min-h-screen bg-background font-sans text-primary-color">
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
        </Suspense>
      </div>
    </AuthProvider>
  );
};

export default App;
