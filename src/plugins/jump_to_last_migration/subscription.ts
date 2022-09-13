import * as vscode from "vscode";
const cp = require("child_process");

export function jumpToLastMigration() {
  cp.exec(
    `ls -r ${vscode.workspace.rootPath}/db/migrate | head -n 1`,
    (err: string, stdout: string, stderr: string) => {
      if (err) {
        vscode.window.showInformationMessage("ERROR: " + err);
      } else if (stderr) {
        vscode.window.showInformationMessage("ERROR: " + stderr);
      } else {
        var fileName = stdout.slice(0, stdout.length - 1);
        var openPath = vscode.Uri.file(
          `${vscode.workspace.rootPath}/db/migrate/${fileName}`
        );
        vscode.workspace.openTextDocument(openPath).then((document) => {
          vscode.window.showTextDocument(document);
        });
      }
    }
  );
}
