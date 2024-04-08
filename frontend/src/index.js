import React from "react";
import ReactDOM from "react-dom/client";
import SocketContext from "./socket-client";
import "./index.css";
import App from "./App";
import Host from "./Host";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import QuizWaiting from "./QuizWaiting";
import AddQuestions from "./AddQuestions";
import Questions from "./Questions";
import { socket } from "./sockets";
import QuizHost from "./QuizHost";
import LeaderBoard from "./Leaderboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <SocketContext.Provider value={socket}>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path="/host" element={<Host />} />
        <Route path="/questions" element={<AddQuestions />} />
        <Route path="/waiting" element={<QuizWaiting />} />
        <Route path="/quiz" element={<Questions />} />
        <Route path="/quizhost" element={<QuizHost />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
      </Routes>
    </BrowserRouter>
  </SocketContext.Provider>
);
