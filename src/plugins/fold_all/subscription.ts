import * as vscode from "vscode";
import * as foldAll from ".";

export function foldAllDescribes() {
  _foldAll(foldAll.foldAllDescribes);
}

export function foldAllContexts() {
  _foldAll(foldAll.foldAllContexts);
}

export function foldAllIts() {
  _foldAll(foldAll.foldAllIts);
}

function _foldAll(linesFunc: (text: string) => number[]) {
  const textEditor = vscode.window.activeTextEditor;
  if (textEditor) {
    const currentPosition = textEditor.selection.active;
    const text = textEditor.document.getText();
    const selections = linesFunc(text).map(
      (line: number): vscode.Selection => new vscode.Selection(line, 0, line, 0)
    );
    textEditor.selections = selections;
    vscode.commands.executeCommand("editor.fold").then((): void => {
      textEditor.selection = new vscode.Selection(
        currentPosition,
        currentPosition
      );
    });
  }
}
