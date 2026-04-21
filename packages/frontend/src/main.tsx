import React from "react";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router";
import ReactDOM from "react-dom/client";
import Quiz from "./pages/Quiz";
import "./styles.css";
import Root from "./pages/Root";
import QuizComplete from "./pages/QuizComplete";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/geography",
        element: <Quiz />,
      },
      {
        path: "/quiz-complete",
        element: <QuizComplete />,
      },
    ],
  },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
