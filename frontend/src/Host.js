import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faExclamation,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { url } from "./global";
import { useNavigate } from "react-router-dom";
import SocketContext from "./socket-client";

function Host() {
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(5);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const s = useContext(SocketContext);

  function generateCode() {
    var code = "";
    for (let index = 0; index < 4; index++) {
      code += String.fromCharCode(Math.floor(Math.random() * 25) + 65);
    }
    setRoomCode(code);
  }

  function hostRoom() {
    if (roomName === "") {
      setError("Enter Room name");
    } else if (roomCode === "") {
      setError("Enter Room code");
    } else {
      const data = {
        room_name: roomName,
        code: roomCode,
        max_players: maxPlayers,
      };
      axios.post(`${url}/rooms/post`, data).then((res) => {
        if (res.data["status"] === 1) {
          s.connect();
          s.emit("join", { name: "host", room: roomCode });
          window.localStorage.setItem("code", roomCode);
          window.localStorage.setItem("name", "host");
          navigate("/questions");
        } else {
          setError(res.data["data"]);
        }
      });
    }
  }

  useEffect(() => {
    if (window.localStorage.getItem("host") !== null) {
      navigate("/questions");
    }
  }, [navigate, roomCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-200 text-white flex flex-col justify-around items-center">
      <div className="text-4xl font-bold flex">
        {/* <button>
          <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
        </button> */}
        <div className="w-full">Host a Quiz</div>
      </div>
      <div className="w-full flex flex-col gap-2 justify-center p-5  text-black md:p-7 md:w-4/5 lg:p-10 lg:w-2/3">
        <div
          className={`text-red-600 text-center text-md md:text-lg lg:text-xl ${
            !error && "invisible"
          }`}
        >
          <FontAwesomeIcon icon={faExclamation} className="mx-3" />
          {`${error}`}
        </div>
        <input
          placeholder="Enter Room name"
          value={roomName}
          onFocus={() => setError("")}
          onChange={(ev) => {
            setRoomName(ev.target.value);
          }}
          className="p-2 rounded"
        ></input>
        <div className="flex gap-2 md:gap-4 lg:gap-6">
          <input
            placeholder="Enter Room code"
            value={roomCode}
            onFocus={() => setError("")}
            onChange={(ev) => {
              setRoomCode(ev.target.value);
            }}
            className="p-2 rounded w-full"
          ></input>
          <button
            className="px-4 py-2 rounded bg-white"
            onClick={() => generateCode()}
          >
            Generate
          </button>
        </div>
        <div className="flex bg-white p-2 rounded">
          <div className="w-full">Max Participants</div>
          <div className="flex px-2">
            <button
              onClick={() => {
                if (maxPlayers > 5) setMaxPlayers(maxPlayers - 1);
              }}
            >
              <FontAwesomeIcon
                icon={faMinus}
                className={`px-2 ${maxPlayers <= 5 && "text-gray-400"}`}
              ></FontAwesomeIcon>
            </button>
            <div className="w-5 text-center text-xl md:w-10 lg:w-10">
              {maxPlayers}
            </div>
            <button
              onClick={() => {
                setError("");
                setMaxPlayers(maxPlayers + 1);
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="px-2"></FontAwesomeIcon>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <button className="p-2 bg-white rounded px-12" onClick={hostRoom}>
            Host
          </button>
        </div>
      </div>
    </div>
  );
}

export default Host;
