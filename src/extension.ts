// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ReadableStreamDefaultController } from 'stream/web';
import * as vscode from 'vscode';
import { HashKeyConverter } from './hash_key_converter';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "ruby-multitool" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.convertSingleKey', () => {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (activeTextEditor !== undefined) {
      let cursorPosition = activeTextEditor.selection.active;
      let oldLineText = activeTextEditor.document.lineAt(activeTextEditor.selection.active).text;
      let newLineText = new HashKeyConverter().convertSingleKey(oldLineText, cursorPosition.character);
      activeTextEditor.edit((textEditor) =>{
        let selection = new vscode.Selection(
          new vscode.Position(cursorPosition.line, 0),
          new vscode.Position(cursorPosition.line, oldLineText.length),
        );
        textEditor.replace(selection, newLineText);
      });
    }
  }));

  context.subscriptions.push(vscode.commands.registerCommand('ruby-multitool.convertAllKeys', () => {
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
  }));

}

// this method is called when your extension is deactivated
export function deactivate() {}
