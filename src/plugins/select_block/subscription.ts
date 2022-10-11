import * as vscode from 'vscode'
import { RubyFileAnalyzer, RubyBlock } from '.'

export function selectAroundBlock() {
  _selectAroundBlock((text, cursorPosition) => new RubyFileAnalyzer().getBlockUnderCursorPosition(text, cursorPosition))
}

export function selectInsideBlock() {
  _selectInsideBlock((text, cursorPosition) => new RubyFileAnalyzer().getBlockUnderCursorPosition(text, cursorPosition))
}

export function selectAroundDefBlock() {
  _selectAroundBlock((text, cursorPosition) => new RubyFileAnalyzer().getDefUnderCursorPosition(text, cursorPosition))
}

export function selectInsideDefBlock() {
  _selectInsideBlock((text, cursorPosition) => new RubyFileAnalyzer().getDefUnderCursorPosition(text, cursorPosition))
}

function _selectAroundBlock(getBlockFunc: ( text: string, cursorPosition: vscode.Position) => RubyBlock | undefined): void {
  const activeTextEditor = vscode.window.activeTextEditor
  if (activeTextEditor !== undefined) {
    const cursorPosition = activeTextEditor.selection.active
    const blockCurrentlyIn = getBlockFunc(activeTextEditor.document.getText(), cursorPosition)
    if (blockCurrentlyIn !== undefined) {
      activeTextEditor.selection = new vscode.Selection(
        new vscode.Position(
          blockCurrentlyIn.blockClosing.line,
          blockCurrentlyIn.blockClosing.endCharacterPosition
        ),
        new vscode.Position(
          blockCurrentlyIn.blockOpening.line,
          blockCurrentlyIn.blockOpening.startCharacterPosition
        )
      )
    }
  }
}

function _selectInsideBlock(
  getBlockFunc: (text: string, cursorPosition: vscode.Position) => RubyBlock | undefined): void {
  const activeTextEditor = vscode.window.activeTextEditor
  if (activeTextEditor !== undefined) {
    const cursorPosition = activeTextEditor.selection.active
    const blockCurrentlyIn = getBlockFunc(activeTextEditor.document.getText(), cursorPosition)
    if (blockCurrentlyIn !== undefined) {
      let startSelectionPosition = new vscode.Position(
        blockCurrentlyIn.blockClosing.line,
        blockCurrentlyIn.blockClosing.startCharacterPosition
      )
      let endSelectionPosition = new vscode.Position(
        blockCurrentlyIn.blockOpening.line,
        blockCurrentlyIn.blockOpening.endCharacterPosition
      )

      if (startSelectionPosition.line !== endSelectionPosition.line) {
        startSelectionPosition = new vscode.Position(
          blockCurrentlyIn.blockClosing.line - 1,
          blockCurrentlyIn.body[blockCurrentlyIn.body.length - 1].length
        )
        endSelectionPosition = new vscode.Position(
          blockCurrentlyIn.blockOpening.line + 1,
          blockCurrentlyIn.body[0].length - blockCurrentlyIn.body[0].trimStart().length
        )
      }

      activeTextEditor.selection = new vscode.Selection(
        startSelectionPosition,
        endSelectionPosition
      )
    }
  }
}
