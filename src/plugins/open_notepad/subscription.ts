import * as vscode from "vscode";
const fse = require("fs-extra");

export function openNotepad(context: vscode.ExtensionContext): void {
  const workspacePath = vscode.workspace.rootPath;
  if (workspacePath === undefined) {
    vscode.window.showErrorMessage("Cannot open notes for a file");
    return;
  }

  const extensionPath = context.extensionPath;
  const notepadPath = `${extensionPath}/projects_notes${workspacePath}/notepad`;
  fse.ensureFile(notepadPath).then(() => {
    vscode.workspace
      .openTextDocument(vscode.Uri.file(notepadPath))
      .then((document) => {
        vscode.window.showTextDocument(document);
      });
  });
}
