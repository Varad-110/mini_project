import { useEffect, useState } from "react";
// import SocketContext from "./socket-client";
import axios from "axios";
import { url } from "./global";
import { useNavigate } from "react-router-dom";

function QuizHost() {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${url}/rooms/get?code=${window.localStorage.getItem("code")}`)
      .then((res) => {
        setQuestions(res.data.data["questions"]);
      });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-200 flex flex-col items-center justify-center gap-3">
      <div className="text-2xl">Questions</div>
      {questions &&
        questions.map((question) => {
          return (
            <div>
              <div className="text-lg">
                {question["qno"]}. {question["questionText"]}
              </div>
            </div>
          );
        })}
      <button
        className="bg-white py-2 px-4 rounded"
        onClick={() => {
          navigate("/leaderboard");
        }}
      >
        Go To LeaderBoard
      </button>
    </div>
  );
}

export default QuizHost;
