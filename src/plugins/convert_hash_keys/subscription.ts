import * as vscode from 'vscode'
import HashKeyConverter from '.'

export function convertSingleHashKey() {
  const activeTextEditor = vscode.window.activeTextEditor
  if (activeTextEditor !== undefined) {
    const cursorPosition = activeTextEditor.selection.active
    const oldLineText = activeTextEditor.document.lineAt(
      activeTextEditor.selection.active
    ).text
    const newLineText = new HashKeyConverter().convertSingleHashKey(
      oldLineText,
      cursorPosition.character
    )
    activeTextEditor.edit((textEditor) => {
      const selection = new vscode.Selection(
        new vscode.Position(cursorPosition.line, 0),
        new vscode.Position(cursorPosition.line, oldLineText.length)
      )
      textEditor.replace(selection, newLineText)
    })
  }
}

export function convertAllHashKeys() {
  const activeTextEditor = vscode.window.activeTextEditor
  if (activeTextEditor === undefined) {
    return
  }
  const cursorPosition = activeTextEditor.selection.active
  if (activeTextEditor?.selection.isEmpty) {
    const expandSelectionAndConvert = (iteration = 0) => {
      vscode.commands.executeCommand('editor.action.smartSelect.expand').then(() => {
        const text = activeTextEditor.document.getText(activeTextEditor.selection)
        if (text.trim()[0] === '{' || text.trim()[0] === '(') {
          const newLineText = new HashKeyConverter().convertAllHashKeys(text)
          activeTextEditor.edit((textEditor) => {
            textEditor.replace(activeTextEditor.selection, newLineText)
          })
          activeTextEditor.selection = new vscode.Selection(cursorPosition, cursorPosition)

          return
        }

        if (iteration < 5) {
          expandSelectionAndConvert(iteration + 1)
        }
      })
    }

    expandSelectionAndConvert()
  } else {
    const text = activeTextEditor.document.getText(activeTextEditor.selection)
    const newLineText = new HashKeyConverter().convertAllHashKeys(text)
    activeTextEditor.edit((textEditor) => {
      textEditor.replace(activeTextEditor.selection, newLineText)
    })
  }
}
