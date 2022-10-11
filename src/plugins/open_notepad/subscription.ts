import * as vscode from 'vscode'
import fse = require('fs-extra')

const EXTENSION_NAME = 'ruby-multitool'

export function openNotepad(context: vscode.ExtensionContext): void {
  const workspacePath = vscode.workspace.rootPath
  if (workspacePath === undefined) {
    vscode.window.showErrorMessage('Cannot open notes for a file')
    return
  }

  const fullExtensionPath = context.extensionPath
  const trimmedExtensionPath = fullExtensionPath.slice(
    0,
    fullExtensionPath.indexOf(EXTENSION_NAME) + EXTENSION_NAME.length
  )
  const notepadPath = `${trimmedExtensionPath}/project_notes${workspacePath}/notepad`
  fse.ensureFile(notepadPath).then(() => {
    vscode.workspace
      .openTextDocument(vscode.Uri.file(notepadPath))
      .then((document) => {
        vscode.window.showTextDocument(document)
      })
  })
}
