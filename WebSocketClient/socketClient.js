const connectionStatus = document.getElementById("connectionStatus");
const connectionId = document.getElementById("connectionId");
const connectionUrl = document.getElementById("connectionUrl");
const startConnectionBtn = document.getElementById("startConnection");
const closeConnectionBtn = document.getElementById("closeConnection");
const message = document.getElementById("message");
const sendMessageBtn = document.getElementById("sendMessage");
const receiver = document.getElementById("receiver");
const messageLog = document.getElementById("messageLog");

connectionUrl.value = "ws://localhost:5000";

startConnectionBtn.onclick = () => {
  connectionStatus.innerHTML = "Establishing connection...";
  socket = new WebSocket(connectionUrl.value);
  socket.onopen = (event) => {
    updateState();
    messageLog.innerHTML +=
      "<tr>" + '<td colspan="3">Connection established</td>' + "</tr>";
  };
  socket.onclose = (event) => {
    updateState();
    messageLog.innerHTML +=
      "<tr>" +
      '<td colspan="3">Connection closed with code: ' +
      htmlEscape(event.code) +
      "Reason:" +
      htmlEscape(event.reason);
    "</td>" + "</tr>";
  };
  socket.onerror = updateState();
  socket.onmessage = (event) => {
    messageLog.innerHTML +=
      "<tr>" +
      "<td>Server</td>" +
      "<td>Client</td>" +
      "<td>" +
      htmlEscape(event.data) +
      "</td>" +
      "</tr>";
  };
};

const htmlEscape = (str) => {
  return str
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&rt;");
};

const updateState = () => {
  const disable = () => {
    sendMessageBtn.disable = true;
    message.disable = true;
    closeConnectionBtn.disable = true;
    receiver.disable = true;
  };
  const enable = () => {
    sendMessageBtn.disable = false;
    message.disable = false;
    closeConnectionBtn.disable = false;
    receiver.disable = false;
  };
  connectionUrl.disable = true;
  startConnectionBtn.disable = true;
  if (!socket) disable();
  else {
    switch (socket.readyState) {
      case WebSocket.CLOSED:
        connectionStatus.innerHTML = "Closed";
        connectionId.innerHTML = "N/A";
        disable();
        connectionUrl.disable = false;
        startConnectionBtn.disable = false;
        break;
      case WebSocket.CLOSING:
        connectionStatus.innerHTML = "Closing...";
        disable();
        break;
      case WebSocket.OPEN:
        connectionStatus.innerHTML = "Open";
        enable();
        break;
      default:
        connectionStatus.innerHTML =
          "Unknown connection state:" + htmlEscape(socket.readyState);
    }
  }
};
