import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Ideas from "../pages/Ideas/Ideas";
import IdeaDetails from "../pages/IdeaDetails/IdeaDetails";
import AddIdea from "../pages/AddIdea/AddIdea";
import MyIdeas from "../pages/MyIdeas/MyIdeas";
import MyInteractions from "../pages/MyInteractions/MyInteractions";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";
import PrivateRoute from "./PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "ideas", element: <Ideas /> },
      {
        path: "ideas/:id",
        element: (
          <PrivateRoute>
            <IdeaDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "add-idea",
        element: (
          <PrivateRoute>
            <AddIdea />
          </PrivateRoute>
        ),
      },
      {
        path: "my-ideas",
        element: (
          <PrivateRoute>
            <MyIdeas />
          </PrivateRoute>
        ),
      },
      {
        path: "my-interactions",
        element: (
          <PrivateRoute>
            <MyInteractions />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
