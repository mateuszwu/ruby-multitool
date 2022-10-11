import * as vscode from 'vscode'
import cp = require('child_process')

export function jumpToLastMigration() {
  cp.exec(
    `ls -r ${vscode.workspace.rootPath}/db/migrate | head -n 1`,
    (err: cp.ExecException | null, stdout: string, stderr: string): void => {
      if (err) {
        vscode.window.showInformationMessage('ERROR: ' + err)
      } else if (stderr) {
        vscode.window.showInformationMessage('ERROR: ' + stderr)
      } else {
        const fileName = stdout.slice(0, stdout.length - 1)
        const openPath = vscode.Uri.file(
          `${vscode.workspace.rootPath}/db/migrate/${fileName}`
        )
        vscode.workspace.openTextDocument(openPath).then((document) => {
          vscode.window.showTextDocument(document)
        })
      }
    }
  )
}
