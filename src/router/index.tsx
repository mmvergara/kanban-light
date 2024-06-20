import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import NotFoundPage from "../pages/404Page.tsx";
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";
import Providers from "../Providers.tsx";
import ProjectPage from "../pages/project/ProjectPage.tsx";

const router = createBrowserRouter([
  // I recommend you reflect the routes here in the pages folder
  {
    path: "/",
    element: <Providers />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      // Auth Protected routes
      {
        path: "/app",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: ":projectId",
            element: <ProjectPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
