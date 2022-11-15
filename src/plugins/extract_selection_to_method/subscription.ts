import * as vscode from 'vscode'
import * as extractSelectionToPrivateMethodModule from '.'

export async function extractSelectionToPrivateMethod(context: vscode.ExtensionContext) {
  const activeTextEditor = vscode.window.activeTextEditor
  if (activeTextEditor !== undefined) {
    const classRubyBlock = await extractSelectionToPrivateMethodModule.extractSelectionToPrivateMethod(
      activeTextEditor.document.getText(),
      activeTextEditor.selection.active,
      activeTextEditor.document.getText(activeTextEditor.selection),
      context.extensionPath
    )

    if(classRubyBlock !== undefined) {
      activeTextEditor.edit((textEditor) => {
        const selection = new vscode.Selection(
          new vscode.Position(classRubyBlock.blockOpening.line + 1, 0),
          new vscode.Position(classRubyBlock.blockClosing.line - 1, 9999)
        )
        textEditor.replace(selection, classRubyBlock.body.join('\n'))
      })

      activeTextEditor.selections = classRubyBlock.selections
    }
    return
  }
}

