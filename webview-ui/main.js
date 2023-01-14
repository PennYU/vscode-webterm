// Get access to the VS Code API from within the webview context
const vscode = acquireVsCodeApi();

const term = new Terminal();
term.prompt = () => {
  term.write('\r\n$ ');
};
term.onKey(e => {
  const ev = e.domEvent;
  const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

  if (ev.keyCode === 13) {
    term.prompt();
  } else if (ev.keyCode === 8) {
    // Do not delete the prompt
    if (term._core.buffer.x > 2) {
      term.write('\b \b');
    }
  } else if (printable) {
    term.write(e.key);
    vscode.postMessage({ command: "input", key: e.key });
  }
});

window.addEventListener("load", main);

function main() {
  setVSCodeMessageListener();

  const connectButton = document.getElementById("connect-button");
  connectButton.addEventListener("click", () => onConnection());

  const sendButton = document.getElementById("send-button");
  sendButton.addEventListener("click", () => onSend());

  term.open(document.getElementById('terminal'));
  term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
}

function setVSCodeMessageListener() {
  window.addEventListener("message", (event) => {
    const {on: evt, data} = event.data;
    switch (evt) {
      case 'data':
        term.write(data);
        break;
    }
  });
}

function onConnection() {
  const host = document.getElementById("host-field").value;
  const port = document.getElementById("port-field").value;
  const username = document.getElementById("username-field").value; 
  const password = document.getElementById("password-field").value; 
  vscode.postMessage({ on: "connection", host, port, username, password });
}

function onSend() {
  const commands = document.getElementById("commands-field").value;
  vscode.postMessage({ on: "data", data: commands });
}
