import { io } from "socket.io-client";

const URL = "http://127.0.0.1:5000";

const socket = io(URL, { autoConnect: false });

// socket.on("connect", function () {
//   socket.send({ msg: `Client connected!` });
// });

// socket.on("disconnect", function () {
//   socket.send({ msg: `Client disconnected!` });
// });

socket.on("message", function (data) {
  console.log(data);
});

export { socket };
