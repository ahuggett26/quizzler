import React from "react";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router";
import ReactDOM from "react-dom/client";
import "./styles.css";
import Root from "./pages/Root";
import QuizSummary from "./components/quiz/QuizSummary";
import PracticeQuiz from "./components/quiz/PracticeQuiz";
import DailyQuiz from "./components/quiz/DailyQuiz";

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
        path: "/geography-daily",
        element: <DailyQuiz />,
      },
      {
        path: "/geography-practice",
        element: <PracticeQuiz />,
      },
    ],
  },
]);

const root = document.getElementById("root")!;

ReactDOM.createRoot(root).render(<RouterProvider router={router} />);
