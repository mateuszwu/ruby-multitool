import * as vscode from 'vscode';

export function copyAbsolutePathWithLineNumber() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (activeTextEditor === undefined) {
    return;
  }

  const absolutePath = activeTextEditor.document.uri.path;
  const lineNumber = activeTextEditor.selection.start.line;
  const absolutePathWithLineNumber = `${absolutePath}:${lineNumber}`;
  vscode.env.clipboard.writeText(absolutePathWithLineNumber);
  vscode.window.showInformationMessage(`${absolutePathWithLineNumber}`);
}

export function copyRelativePathWithLineNumber() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (activeTextEditor === undefined) {
    return;
  }
  const workspace = vscode.workspace;
  if (workspace === undefined) {
    vscode.window.showErrorMessage('The Relative path can only be shown for a file within a workspace.');
    return;
  }

  const absolutePath = activeTextEditor.document.uri.path;
  const relativePath = absolutePath.split(`${workspace.name}/`)[1];
  const lineNumber = activeTextEditor.selection.start.line;
  const relativePathWithLineNumber = `${relativePath}:${lineNumber}`;
  vscode.env.clipboard.writeText(relativePathWithLineNumber);
  vscode.window.showInformationMessage(`${relativePathWithLineNumber}`);
}

