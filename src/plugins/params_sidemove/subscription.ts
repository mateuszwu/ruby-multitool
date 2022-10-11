import * as vscode from 'vscode'
import ParamsSidemove from '.'

export function moveRight() {
  const activeTextEditor = vscode.window.activeTextEditor
  if (activeTextEditor !== undefined) {
    const cursorPosition = activeTextEditor.selection.active
    const moveAreaSelection = new vscode.Selection(
      new vscode.Position(cursorPosition.line, 0),
      new vscode.Position(cursorPosition.line + 2, 0)
    )
    const oldText = activeTextEditor.document.getText(moveAreaSelection)
    const { text: newText, cursorOffsetPosition } = new ParamsSidemove().moveRight(oldText, cursorPosition)
    activeTextEditor.edit((textEditor) => {
      textEditor.replace(moveAreaSelection, newText)
    })
    const newPosition = cursorPosition.translate(cursorOffsetPosition.line, cursorOffsetPosition.character)
    activeTextEditor.selection = new vscode.Selection(newPosition, newPosition)
  }
}

export function moveLeft() {
  const activeTextEditor = vscode.window.activeTextEditor
  if (activeTextEditor !== undefined) {
    const cursorPosition = activeTextEditor.selection.active
    const moveAreaSelection = new vscode.Selection(
      new vscode.Position(cursorPosition.line > 0 ? cursorPosition.line - 1 : 0, 0),
      new vscode.Position(cursorPosition.line + 1, 0)
    )
    const oldText = activeTextEditor.document.getText(moveAreaSelection)
    const { text: newText, cursorOffsetPosition } = new ParamsSidemove().moveLeft(oldText, cursorPosition)
    activeTextEditor.edit((textEditor) => {
      textEditor.replace(moveAreaSelection, newText)
    })
    const newPosition = cursorPosition.translate(cursorOffsetPosition.line, cursorOffsetPosition.character)
    activeTextEditor.selection = new vscode.Selection(newPosition, newPosition)
  }
}
