import axios from "axios";
import { useEffect, useState } from "react";
import { url } from "./global";
import { useNavigate } from "react-router-dom";

function LeaderBoard() {
  const [room, setRoom] = useState({});
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${url}/rooms/get?code=${window.localStorage.getItem("code")}`)
      .then((res) => {
        setRoom(res.data.data);
        setPlayers(res.data.data["players"]);
      });
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-200 flex flex-col items-center justify-start">
      <div className="text-4xl font-bold p-5">LeaderBoard</div>
      <div className="text-3xl">{room["code"]}</div>
      <div className="text-xl mt-5">Top Scorers</div>
      <div>
        {players
          .sort((a, b) => a["score"] - b["score"])
          .map((player) => (
            <div className="flex gap-5">
              <div className="text-xl">{`${player["name"]} - ${player["score"]}`}</div>
            </div>
          ))}
      </div>
      <button
        className="py-2 px-5 bg-white rounded absolute bottom-5"
        onClick={() => {
          navigate("/");
        }}
      >
        Go To Homepage
      </button>
    </div>
  );
}
export default LeaderBoard;
