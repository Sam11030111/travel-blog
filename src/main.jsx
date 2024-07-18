import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { ThemeContextProvider } from "./context/ThemeContext.jsx";
import { ThemeProvider } from "./providers/ThemeProvider.jsx";
import Root from "./routes/root.jsx";
import ErrorPage from "./error-page.jsx";
import Login from "./routes/login.jsx";
import Explore from "./routes/explore.jsx";
import Write from "./routes/write.jsx";
import SignUp from "./routes/signup.jsx";
import SinglePost from "./routes/singlePost.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import {
  exploreLoader,
  writeLoader,
  singlePostLoader,
  singleUserLoader,
} from "./utils/loader.js";
import Home from "./components/home/Home.jsx";
import Users from "./routes/users.jsx";
import SingleUser from "./routes/singleUser.jsx";
import AddUser from "./routes/addUser.jsx";

const loadGoogleMapsScript = () => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  }&libraries=places,marker&loading=async&v=beta`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
};

loadGoogleMapsScript();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/explore",
        element: <Explore />,
        loader: exploreLoader,
        children: [
          {
            path: ":postId",
            element: <SinglePost />,
            loader: singlePostLoader,
          },
        ],
      },
      {
        path: "/write",
        element: <Write />,
        loader: writeLoader,
        children: [
          {
            path: ":postId",
            element: <Write />,
          },
        ],
      },
      {
        path: "/users",
        element: <Users />,
        children: [
          {
            path: ":userId",
            element: <SingleUser />,
            loader: singleUserLoader,
          },
          {
            path: "add",
            element: <AddUser />,
          },
        ],
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeContextProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </ThemeContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
