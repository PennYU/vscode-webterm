import { Webview, Uri } from "vscode";
import { Note } from "../types/Note";
import { getUri } from "../utilities/getUri";

/**
 * Defines and returns the HTML that should be rendered within the notepad webview panel.
 *
 * @remarks This is also the place where references to CSS and JavaScript files/packages
 * (such as the Webview UI Toolkit) are created and inserted into the webview HTML.
 *
 * @param webview A reference to the extension webview
 * @param extensionUri The URI of the directory containing the extension
 * @param note An object representing a notepad note
 * @returns A template string literal containing the HTML that should be
 * rendered within the webview panel
 */
export function getWebviewContent(webview: Webview, extensionUri: Uri, note: Note) {
  const toolkitUri = getUri(webview, extensionUri, [
    "node_modules",
    "@vscode",
    "webview-ui-toolkit",
    "dist",
    "toolkit.js",
  ]);
  const styleUri = getUri(webview, extensionUri, ["webview-ui", "style.css"]);
  const mainUri = getUri(webview, extensionUri, ["webview-ui", "main.js"]);
  const termStyleUri = getUri(webview, extensionUri, ["node_modules", "xterm", "css", "xterm.css"]);
  const termUri = getUri(webview, extensionUri, ["node_modules", "xterm", "lib", "xterm.js"]);

  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script type="module" src="${toolkitUri}"></script>
          <script type="module" src="${mainUri}"></script>
          <link rel="stylesheet" href="${styleUri}">
          <link rel="stylesheet" href="${termStyleUri}"/>
          <script src="${termUri}"></script>
          <title>${note.title}</title>
      </head>
      <body id="webview-body">
        <header>
          <h1>${note.title}</h1>
        </header>
        <section id="form-class">
          <section id="session-form">
            <span class="label-class">Host</span>
            <vscode-text-field
              id="host-field"
              class="input-class"
              size="20"
              placeholder="IP or domain name. e.g. 127.0.0.1">
            </vscode-text-field>
            <span class="label-class">Port</span>
            <vscode-text-field
              id="port-field"
              class="input-class"
              size="5"
              placeholder="Port. e.g. 22">
            </vscode-text-field>
            <span class="label-class">Username</span>
            <vscode-text-field
              id="username-field"
              class="input-class"
              size="20"
              placeholder="Username">
            </vscode-text-field>
            <span class="label-class">Password</span>
            <vscode-text-field
              id="password-field"
              class="input-class"
              size="20"
              type="Password"
              placeholder="Password">
            </vscode-text-field>
            <vscode-button id="connect-button">Connect</vscode-button>
          </section>
        </section>
        <section id="form-class">
          <div id="terminal"></div>
          <vscode-button id="send-button">Run</vscode-button>
          <vscode-text-area
            id="commands-field"
            placeholder="Write commmands to run"
            resize="vertical"
            rows=15>
          </vscode-text-area>
        </session>
      </body>
    </html>
  `;
}
