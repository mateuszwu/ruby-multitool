import * as vscode from "vscode";
import HashKeyConverter from '.';

export function convertSingleKey() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (activeTextEditor !== undefined) {
    let cursorPosition = activeTextEditor.selection.active;
    let oldLineText = activeTextEditor.document.lineAt(
      activeTextEditor.selection.active
    ).text;
    let newLineText = new HashKeyConverter().convertSingleKey(
      oldLineText,
      cursorPosition.character
    );
    activeTextEditor.edit((textEditor) => {
      let selection = new vscode.Selection(
        new vscode.Position(cursorPosition.line, 0),
        new vscode.Position(cursorPosition.line, oldLineText.length)
      );
      textEditor.replace(selection, newLineText);
    });
  }
}

export function convertAllKeys() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (activeTextEditor === undefined) {
    return;
  }
  let cursorPosition = activeTextEditor.selection.active;
  if (activeTextEditor?.selection.isEmpty) {
    let expandSelectionAndConvert = (iteration = 0) => {
      vscode.commands.executeCommand('editor.action.smartSelect.expand').then(() => {
        let text = activeTextEditor.document.getText(activeTextEditor.selection);
        if (text.trim()[0] === '{' || text.trim()[0] === '(') {
          let newLineText = new HashKeyConverter().convertAllKeys(text);
          activeTextEditor.edit((textEditor) => {
            textEditor.replace(activeTextEditor.selection, newLineText);
          });
          activeTextEditor.selection = new vscode.Selection(cursorPosition, cursorPosition);

          return;
        }

        if (iteration < 5) {
          expandSelectionAndConvert(iteration + 1);
        }
      });
    };

    expandSelectionAndConvert();
  } else {
    let text = activeTextEditor.document.getText(activeTextEditor.selection);
    let newLineText = new HashKeyConverter().convertAllKeys(text);
    activeTextEditor.edit((textEditor) => {
      textEditor.replace(activeTextEditor.selection, newLineText);
    });
  }
}
