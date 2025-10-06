import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import PostPage from "./pages/PostPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RootRoute from "./routes/RootRoute.jsx";
import SurveyRoute from "./routes/SurveyRoute.jsx";
import SurveyPage from "./pages/SurveyPage.jsx";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* Root Path */}
        <Route path="/">
          <Route index element={<LoginPage />} />
        </Route>
        
        {/* Home Path */}
        <Route path="/home" element={<RootRoute />}>
          <Route index element={<PostPage />} />
        </Route>

        {/* Survey Path */}
        <Route path="/client/survey" element={<SurveyRoute />} >
          <Route path="create" element={<SurveyPage />}/>
        </Route>
      </>,
    ),
  );

  return (
    <div data-theme="light" className="h-[100vh]">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
