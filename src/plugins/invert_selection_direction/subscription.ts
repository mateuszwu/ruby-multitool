import * as vscode from 'vscode'

export function invertSelectionDirection() {
  const activeTextEditor = vscode.window.activeTextEditor
  if (activeTextEditor !== undefined) {
    activeTextEditor.selections = activeTextEditor.selections.map((selection: vscode.Selection) => {
      return new vscode.Selection(selection.active, selection.anchor)
    })
    vscode.commands.executeCommand('cursorMove', {
      to: 'left',
      select: true,
      by: 'character',
      value: 1,
    })
    vscode.commands.executeCommand('cursorMove', {
      to: 'right',
      select: true,
      by: 'character',
      value: 1,
    })
  }
}
