import * as vscode from 'vscode'
import * as changeRubyBlockSyntaxModule from '.'

export function changeRubyBlockSyntax() {
  const activeTextEditor = vscode.window.activeTextEditor
  if (activeTextEditor === undefined) {
    return
  }

  const newSelectedText = changeRubyBlockSyntaxModule.changeRubyBlockSyntax(
    activeTextEditor.document.getText(activeTextEditor.selection), activeTextEditor.document.getText()
  )

  activeTextEditor.edit((textEditor) => {
    textEditor.replace(activeTextEditor.selection, newSelectedText)
  })
}
