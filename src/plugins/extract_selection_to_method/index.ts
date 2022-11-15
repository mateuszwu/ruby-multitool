import * as vscode from 'vscode'
import { RubyFileAnalyzer, RubyBlock } from '../select_block'

const PRIVATE_TEXT = 'private'
const TAB_INDENTATION = 2
const EXTRACT_METHOD_NAME = 'change_me!'

export async function extractSelectionToPrivateMethod(fileText: string, cursorPosition: vscode.Position, selectedText: string, extensionPath: string): Promise<RubyBlock | undefined> {
  const classRubyBlock = await new RubyFileAnalyzer().getClassUnderCursorPosition(fileText, cursorPosition, extensionPath)
  if (classRubyBlock !== undefined) {
    const privateMethodLine = classRubyBlock.body.find((line: string) => line.trim() === PRIVATE_TEXT)

    if (privateMethodLine !== undefined) {
      const privateMethodLinePosition = classRubyBlock.body.indexOf(privateMethodLine)

      classRubyBlock.body = [
        ...classRubyBlock.body.slice(0, privateMethodLinePosition + 1),
        ..._newMethod(classRubyBlock, selectedText),
        ...classRubyBlock.body.slice(privateMethodLinePosition + 1),
      ]
    } else {
      classRubyBlock.body.push(...[
        '',
        `${' '.repeat(classRubyBlock.indentationLength + TAB_INDENTATION)}private`,
        ..._newMethod(classRubyBlock, selectedText),
      ])
    }
    _replaceSelectedTextWithExtractMethodNameText(classRubyBlock, selectedText)
    _setRubyBlockSelections(classRubyBlock)

    return classRubyBlock
  }
}

function _replaceSelectedTextWithExtractMethodNameText(classRubyBlock: RubyBlock, selectedText: string): void {
  classRubyBlock.body = classRubyBlock.body
    .join('\n')
    .replace(selectedText, EXTRACT_METHOD_NAME)
    .split('\n')
}

function _setRubyBlockSelections(classRubyBlock: RubyBlock):void {
  classRubyBlock.selections = classRubyBlock.body
    .map((line: string, index: number): vscode.Selection | undefined => {
      const extractMethodNameIndex = line.indexOf(EXTRACT_METHOD_NAME)
      if (extractMethodNameIndex !== -1) {
        return new vscode.Selection(
          new vscode.Position(classRubyBlock.blockOpening.line + index + 1, extractMethodNameIndex),
          new vscode.Position(classRubyBlock.blockOpening.line + index + 1, extractMethodNameIndex + EXTRACT_METHOD_NAME.length)
        )
      }
    })
    .filter((element: vscode.Selection | undefined): boolean => element !== undefined) as vscode.Selection[]
}


function _newMethod(classRubyBlock: RubyBlock, methodBody: string): string[] {
  const methodDefinitionIndentation = ' '.repeat(classRubyBlock.indentationLength + TAB_INDENTATION)
  const methodBodyIndentation = ' '.repeat(classRubyBlock.indentationLength + TAB_INDENTATION * 2)
  const methodBodyArray = methodBody.split('\n')
  const firstNonZeroIndentation = methodBodyArray
    .map((line: string) => line.length - line.trimStart().length)
    .sort((x, y) => x - y)
    .find((indentation: number) => indentation !== 0)
  const methodBodyArrayWithFixedIndentation = methodBodyArray.map(
    (line: string) => {
      const lineIndentation = line.length - line.trimStart().length

      if (lineIndentation === 0) {
        return line
      } else {
        return line.substring(firstNonZeroIndentation || 0)
      }
    }
  )

  return [
    '',
    `${methodDefinitionIndentation}def ${EXTRACT_METHOD_NAME}`,
    ...methodBodyArrayWithFixedIndentation.map(
      (line: string) => `${methodBodyIndentation}${line}`
    ),
    `${methodDefinitionIndentation}end`,
  ]
}
