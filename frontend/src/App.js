import { useContext, useState } from "react";
import axios from "axios";
import { url } from "./global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import SocketContext from "./socket-client";

function App() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const s = useContext(SocketContext);
  const navigate = useNavigate();

  function goToWaiting() {
    window.localStorage.setItem("name", name);
    window.localStorage.setItem("code", code);
    navigate("/waiting");
  }

  function onClick() {
    if (name === "") {
      setError("Choose a nickname");
    } else if (code === "") {
      setError("Enter a room code");
    } else {
      axios.get(`${url}/rooms/get?code=${code}`).then((res) => {
        if (res.data["status"] === -1) {
          setError(res.data["data"]);
        } else {
          axios
            .post(`${url}/rooms/players/add?code=${code}`, {
              name,
            })
            .then((res) => {
              if (res.data["status"] === 1) {
                window.localStorage.setItem("name", name);
                window.localStorage.setItem("code", code);
                //Go to Quiz Waiting Page
                console.log("Player added!");
                s.connect();
                s.emit("join", { name: name, room: code });
                goToWaiting();
              } else {
                setError(res.data["data"]);
              }
            });
        }
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-200 text-white flex flex-col justify-around items-center">
      <div className="text-5xl font-bold">Quiz System</div>
      <div className="w-full flex flex-col gap-2 justify-center p-5  text-black md:p-7 md:w-4/5 lg:p-10 lg:w-2/3">
        <div
          className={`text-red-600 text-center text-lg ${
            !error && "invisible"
          }`}
        >
          <FontAwesomeIcon icon={faExclamation} className="mx-3" />
          {`${error}`}
        </div>

        <input
          placeholder="Enter Nickname"
          value={name}
          className="p-2 rounded"
          onFocus={() => setError("")}
          onChange={(ev) => {
            setName(ev.target.value);
          }}
        ></input>
        <input
          placeholder="Enter Roomcode"
          value={code}
          onFocus={() => setError("")}
          onChange={(ev) => setCode(ev.target.value)}
          className="p-2 rounded"
        ></input>
        <div className="flex gap-5 justify-center">
          <button
            className="bg-white text-black py-1.5 px-3 rounded pointer active:bg-gray-300"
            onClick={onClick}
          >
            Join Room
          </button>
          <button
            className="bg-white text-black py-1.5 px-3 rounded active:bg-gray-300"
            onClick={() => navigate("/host")}
          >
            Host Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
