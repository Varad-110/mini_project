import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamation, faTrash } from "@fortawesome/free-solid-svg-icons";
import { url } from "./global";
import axios from "axios";

function AddQuestions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [correct, setCorrect] = useState("");

  function goToWaiting() {
    navigate("/waiting");
  }

  function addQuestion() {
    if (questionText === "") {
      setError("Enter question text");
    } else if (a === "" || b === "" || c === "" || d === "") {
      setError("Enter all options");
    } else if (correct === "") {
      setError("Enter correct option");
    } else {
      const data = {
        qno: questions.length + 1,
        questionText,
        options: { a: a, b: b, c: c, d: d },
        correct_option: correct.toLowerCase(),
      };
      setQuestions((prev) => [...prev, data]);
      setQuestionText("");
      setA("");
      setB("");
      setC("");
      setD("");
      setCorrect("");
      console.log(questions);
    }
  }

  function start() {
    console.log(questions);
    axios
      .post(
        `${url}/rooms/questions/add?code=${window.localStorage.getItem(
          "code"
        )}`,
        questions
      )
      .then((res) => {
        console.log(res.data);
        window.localStorage.setItem("name", "host");
        if (res.data["status"] === 1) {
          navigate("/waiting");
        }
      });
  }

  function deleteQuestion(index) {
    const temp = questions.filter((item, i) => i !== index);
    setQuestions(temp);
  }

  useEffect(() => {
    if (
      window.localStorage.getItem("isQuestionsAdded") !== null &&
      window.localStorage.getItem("isQuestionsAdded") === true
    ) {
      goToWaiting();
    }

    if (window.localStorage.getItem("code") === null) {
      navigate("/host");
    }
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-200 text-white flex flex-col items-center">
      <div className="w-full flex flex-col gap-2 justify-center p-5  text-black md:p-7 md:w-4/5 lg:p-10 lg:w-2/3">
        <div className="flex justify-between">
          <div className="text-xl font-bold">Add Questions</div>
          <button
            className="py-2 px-4 bg-white rounded"
            onClick={() => start()}
          >
            Start
          </button>
        </div>

        <div
          className={`text-red-500 flex gap-2 items-center ${
            !error && "invisible"
          }`}
        >
          <FontAwesomeIcon icon={faExclamation}></FontAwesomeIcon>
          {error}
        </div>
        <input
          placeholder="Enter Question text"
          className="p-2 rounded w-full"
          onChange={(ev) => {
            setQuestionText(ev.target.value);
          }}
          onFocus={() => {
            setError("");
          }}
          value={questionText}
        ></input>
        <div className="grid grid-cols-1 gap-1 py-3 md:grid-cols-2 lg:grid-cols-2">
          <div className="flex gap-4 items-center justify-center">
            <div>A.</div>
            <input
              onChange={(ev) => {
                setA(ev.target.value);
              }}
              value={a}
              onFocus={() => {
                setError("");
              }}
              className="p-1 rounded md:p-2 lg:p-2"
            ></input>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <div>B.</div>
            <input
              onChange={(ev) => {
                setB(ev.target.value);
              }}
              onFocus={() => {
                setError("");
              }}
              className="p-1 rounded md:p-2 lg:p-2"
              value={b}
            ></input>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <div>C.</div>
            <input
              onChange={(ev) => {
                setC(ev.target.value);
              }}
              onFocus={() => {
                setError("");
              }}
              className="p-1 rounded md:p-2 lg:p-2"
              value={c}
            ></input>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <div>D.</div>
            <input
              onChange={(ev) => {
                setD(ev.target.value);
              }}
              onFocus={() => {
                setError("");
              }}
              className="p-1 rounded md:p-2 lg:p-2"
              value={d}
            ></input>
          </div>
        </div>
        <div className="flex gap-3 items-center justify-start">
          <input
            placeholder="Enter correct option"
            className="p-2 rounded w-full md:w-auto lg:w-auto"
            value={correct}
            onChange={(ev) => setCorrect(ev.target.value)}
          ></input>
        </div>
        <button
          className="bg-white self-center px-10 py-2 mt-3 rounded"
          onClick={addQuestion}
        >
          Add
        </button>
        <div className="w-full border-2"></div>
        {questions && (
          <ul>
            {questions.map((question) => {
              return (
                <li
                  key={question["qno"]}
                  className="flex justify-between gap-4 p-4"
                >
                  <div>
                    <div className="text-lg flex gap-2 font-medium">
                      <p>{question["qno"]}.</p>
                      <p>{question["questionText"]}</p>
                    </div>
                    <div className="grid grid-cols-2">
                      {Object.keys(question["options"]).map((item, i) => {
                        return (
                          <div>
                            {item}. {question["options"][item]}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      deleteQuestion(questions.indexOf(question));
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} size="lg"></FontAwesomeIcon>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default AddQuestions;
