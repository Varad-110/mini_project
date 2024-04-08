import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { url } from "./global";
import { useNavigate } from "react-router-dom";

function Questions() {
  const initialTime = 10;
  const [selectedOption, setSelectedOption] = useState("");
  const [questions, setQuestions] = useState([]);
  const [player, setPlayer] = useState({});
  const [seconds, setSeconds] = useState(initialTime);
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const name = window.localStorage.getItem("name");
  const [showAnswerScreen, setShowAnswerScreen] = useState(false);
  const [message, setMessage] = useState(null);
  const [correct, setCorrect] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${url}/rooms/get?code=${window.localStorage.getItem("code")}`)
      .then((res) => {
        setQuestions(res.data.data["questions"]);
        const _p = res.data.data["players"];
        for (let i = 0; i < _p.length; i++) {
          if (_p[i]["name"] === name) {
            setPlayer(_p[i]);
          }
        }
      });
  }, [name]);

  const incrementIndex = useCallback(() => {
    if (index >= questions.length - 1) {
      console.log("finished");
      navigate("/leaderboard");
    } else {
      console.log(index);
      setIndex(index + 1);
    }
  }, [index, questions.length, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    if (seconds === 0) {
      if (showAnswerScreen) {
        setPrevIndex(index);
        incrementIndex();
        setShowAnswerScreen(false);
      } else {
        setShowAnswerScreen(true);
      }
      if (index < questions.length) {
        setSeconds(initialTime);
      } else {
        clearInterval(interval);
        navigate("/leaderboard");
      }
    }

    return () => clearInterval(interval);
  }, [
    seconds,
    showAnswerScreen,
    incrementIndex,
    initialTime,
    index,
    questions.length,
    navigate,
  ]);

  function checkAnswer() {
    console.log("Clicked!");
    axios
      .post(
        `${url}/rooms/questions/check?code=${window.localStorage.getItem(
          "code"
        )}`,
        {
          number: index + 1,
          option: selectedOption,
          time: initialTime - seconds,
          player_name: name,
        }
      )
      .then((res) => {
        if (res.data["status"] === 1) {
          // setSeconds(initialTime);
          setMessage("Answer entered was correct!");
        } else {
          const msg =
            res.data.data["msg"] +
            ` Correct Answer was: ${res.data.data["correct"]}`;
          setMessage(msg);
        }
        setShowAnswerScreen(true);
        setSeconds(seconds + initialTime);
      });
    setSelectedOption("");
  }
  if (showAnswerScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-200 flex flex-col items-center justify-center">
        <div>{` ${message}`}</div>
        <div>Next Question in: {seconds}</div>
      </div>
    );
  } else {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-200 flex flex-col items-center justify-center gap-5">
        <div className="absolute top-5 right-5 text-xl">
          {player && player["score"]}
        </div>
        <div className="text-xl">{seconds}</div>
        {questions[index] && (
          <div className="flex gap-5 flex-col">
            <div className="text-3xl font-bold ">
              {questions[index]["questionText"]}
            </div>
            <div className="grid grid-cols-2 gap-5">
              {Object.keys(questions[index]["options"]).map((value) => (
                <button
                  key={value}
                  className={`border-solid border-2 rounded ${
                    value === selectedOption
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  onClick={() => {
                    if (value === "a") {
                      setSelectedOption("a");
                    } else if (value === "b") {
                      setSelectedOption("b");
                    } else if (value === "c") {
                      setSelectedOption("c");
                    } else if (value === "d") {
                      setSelectedOption("d");
                    }
                  }}
                >
                  {value}. {questions[index]["options"][value]}
                </button>
              ))}
            </div>
            <button
              className="py-2 px-5 rounded bg-white"
              onClick={() => {
                checkAnswer();
              }}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    );
  }
}
export default Questions;
