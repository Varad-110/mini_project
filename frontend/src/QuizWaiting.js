import axios from "axios";
import { useCallback, useContext, useEffect, useState } from "react";
import { url } from "./global";
import SocketContext from "./socket-client";
import { useNavigate } from "react-router-dom";

function QuizWaiting() {
  const name = window.localStorage.getItem("name");
  const code = window.localStorage.getItem("code");
  const s = useContext(SocketContext);
  const [room, setRoom] = useState(null);
  // const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();

  const fetchData = useCallback(() => {
    axios.get(`${url}/rooms/get?code=${code}`).then((res) => {
      setRoom(res.data.data);
    });
  }, [code]);

  useEffect(() => {
    axios.get(`${url}/rooms/get?code=${code}`).then((res) => {
      setRoom(res.data.data);
    });
  }, [code]);

  useEffect(() => {
    s.on("message", (data) => {
      if (data.includes("joined")) {
        fetchData();
      } else if (data === "start" && name !== "host") {
        navigate("/quiz");
      } else if (data === "start" && name === "host") {
        // navigate("/quizhost");
      }
    });
  }, [code, fetchData, name, s, navigate, room]);

  if (room === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-200 flex"></div>
    );
  } else {
    return name === "host" ? (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-200 flex flex-col gap-10 items-center">
        <div>
          <div className="text-center p-5 text-3xl">{room["room_name"]}</div>
          <div className="text-center text-xl">{room["code"]}</div>
        </div>
        <div className="text-center">
          <div className="text-lg">Participants</div>
          {room["players"] && (
            <ol className="list-disc">
              {room["players"].map((player) => {
                return <li key={player["id"]}>{player["name"]}</li>;
              })}
            </ol>
          )}
        </div>
        {
          <button
            className="py-2 px-5 bg-white rounded w-auto"
            onClick={() => {
              s.emit("start", { room: code });
              console.log("Clicked!");
              navigate("/quizhost");
            }}
          >
            Start Quiz
          </button>
        }
      </div>
    ) : (
      room && (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-200 flex flex-col items-center justify-center">
          <div className="text-3xl">{name}</div>
          <div>Waiting for the host to start the quiz</div>
        </div>
      )
    );
  }
}

export default QuizWaiting;
