import * as vscode from 'vscode';
import * as extractToPrivateMethodModule from '.';

export function extractToPrivateMethod() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (activeTextEditor !== undefined) {
    const classRubyBlock = extractToPrivateMethodModule.extractToPrivateMethod(
      activeTextEditor.document.getText(),
      activeTextEditor.selection.active,
      activeTextEditor.document.getText(activeTextEditor.selection)
    );

    if(classRubyBlock !== undefined) {
      activeTextEditor.edit((textEditor) => {
        const selection = new vscode.Selection(
          new vscode.Position(classRubyBlock.blockOpening.line + 1, 0),
          new vscode.Position(classRubyBlock.blockClosing.line - 1, 9999)
        );
        textEditor.replace(selection, classRubyBlock.body.join('\n'));
      });

      activeTextEditor.selections = classRubyBlock.selections;
    }
    return;
  }
}

