import * as vscode from 'vscode'
import * as extractToPrivateMethodModule from '.'

export function changeRubyBlockSyntax() {
  const activeTextEditor = vscode.window.activeTextEditor
  if (activeTextEditor === undefined) {
    return
  }

  const newSelectedText = extractToPrivateMethodModule.changeRubyBlockSyntax(
    activeTextEditor.document.getText(activeTextEditor.selection)
  )

  activeTextEditor.edit((textEditor) => {
    textEditor.replace(activeTextEditor.selection, newSelectedText)
  })
}
