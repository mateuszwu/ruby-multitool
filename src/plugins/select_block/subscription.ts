import * as vscode from "vscode";
import { RubyFileAnalyzer } from '.';

export function selectAroundBlock() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (activeTextEditor !== undefined) {
    const cursorPosition = activeTextEditor.selection.active;
    const blockCurrentlyIn = new RubyFileAnalyzer().getBlockUnderCursorPosition(
      activeTextEditor.document.getText(),
      cursorPosition
    );
    if (blockCurrentlyIn !== undefined) {
      activeTextEditor.selection = new vscode.Selection(
        new vscode.Position(blockCurrentlyIn.blockClosing.line, blockCurrentlyIn.blockClosing.endCharacterPosition),
        new vscode.Position(blockCurrentlyIn.blockOpening.line, blockCurrentlyIn.blockOpening.startCharacterPosition),
      );
    }
  }
}

export function selectInsideBlock() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (activeTextEditor !== undefined) {
    const cursorPosition = activeTextEditor.selection.active;
    const blockCurrentlyIn = new RubyFileAnalyzer().getBlockUnderCursorPosition(
      activeTextEditor.document.getText(),
      cursorPosition
    );
    if (blockCurrentlyIn !== undefined) {
      let startSelectionPosition = new vscode.Position(blockCurrentlyIn.blockClosing.line, blockCurrentlyIn.blockClosing.startCharacterPosition);
      let endSelectionPosition = new vscode.Position(blockCurrentlyIn.blockOpening.line, blockCurrentlyIn.blockOpening.endCharacterPosition);

      if (startSelectionPosition.line !== endSelectionPosition.line) {
        startSelectionPosition = new vscode.Position(
          blockCurrentlyIn.blockClosing.line - 1,
          blockCurrentlyIn.body[blockCurrentlyIn.body.length - 1].length
        );
        endSelectionPosition = new vscode.Position(
          blockCurrentlyIn.blockOpening.line + 1,
          blockCurrentlyIn.body[0].length - blockCurrentlyIn.body[0].trimStart().length
        );
      }

      activeTextEditor.selection = new vscode.Selection(
        startSelectionPosition,
        endSelectionPosition,
      );
    }
  }
}
