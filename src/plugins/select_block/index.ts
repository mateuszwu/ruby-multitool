import * as vscode from 'vscode'
import * as Parser from 'web-tree-sitter'
Parser.init()

interface RubyBlockDetails {
  text: string;
  line: number;
  startCharacterPosition: number;
  endCharacterPosition: number;
}

export interface RubyBlock {
  indentationLength: number;
  blockOpening: RubyBlockDetails;
  body: string[];
  blockClosing: RubyBlockDetails;
  selections: vscode.Selection[]
}

const MODULE = 'module'
const CLASS = 'class'
const METHOD = 'method'
const IF = 'if'
const UNLESS = 'unless'
const WHILE = 'while'
const FOR = 'for'
const DO_BLOCK = 'do_block'
const CASE = 'case'
const BEGIN = 'begin'
const DO = 'do'

const PROGRAM = 'program'
const METHOD_PARAMETERS = 'method_parameters'
const BLOCK_PARAMETERS = 'block_parameters'
const IN = 'in'

const BLOCK_TYPES = [
  MODULE,
  CLASS,
  METHOD,
  IF,
  UNLESS,
  WHILE,
  FOR,
  DO_BLOCK,
  CASE,
  BEGIN,
  DO,
]

export class RubyFileAnalyzer {
  async getBlockUnderCursorPosition(text: string, cursorPosition: vscode.Position): Promise<RubyBlock | undefined> {
    const tree = await this._analyze(text)
    const currentNode = tree.rootNode.descendantForPosition({
      row: cursorPosition.line,
      column: cursorPosition.character,
    })
    let blockNode: Parser.SyntaxNode = currentNode

    if (blockNode.parent !== null && BLOCK_TYPES.find((nodeType: string) => blockNode.type === nodeType) !== undefined) {
      blockNode = blockNode.parent
    } else {
      while (blockNode.type !== PROGRAM && BLOCK_TYPES.find((nodeType: string) => blockNode.type === nodeType) === undefined) {
        if (blockNode.parent !== null) {
          blockNode = blockNode.parent
        }
      }
    }

    let openingEndCharacterPosition = 0
    if (blockNode.type === MODULE || blockNode.type === CLASS || blockNode.type === IF || blockNode.type === UNLESS || blockNode.type === WHILE || blockNode.type === CASE) {
      openingEndCharacterPosition = blockNode.child(1)?.endPosition.column || 0
    } else if (blockNode.type === METHOD || blockNode.type === FOR) {
      const isMethodWithParams = blockNode.child(2) !== null && (blockNode.child(2)!.type === METHOD_PARAMETERS || blockNode.child(2)!.type === IN)
      openingEndCharacterPosition = blockNode.child(isMethodWithParams ? 2 : 1)?.endPosition.column || 0
    } else if (blockNode.type === BEGIN) {
      openingEndCharacterPosition = blockNode.child(0)?.endPosition.column || 0
    } else if (blockNode.type === DO_BLOCK) {
      const isMethodWithParams = blockNode.child(1) !== null && blockNode.child(1)!.type === BLOCK_PARAMETERS
      openingEndCharacterPosition = blockNode.child(isMethodWithParams ? 1 : 0)?.endPosition.column || 0
    }

    return this._convertBlockNodeToRubyBlock(blockNode, openingEndCharacterPosition, text)
  }

  async getClassUnderCursorPosition(text: string, cursorPosition: vscode.Position): Promise<RubyBlock | undefined> {
    const tree = await this._analyze(text)
    const currentNode = tree.rootNode.descendantForPosition({
      row: cursorPosition.line,
      column: cursorPosition.character,
    })
    let blockNode: Parser.SyntaxNode = currentNode

    if (blockNode.parent !== null && [CLASS].find((nodeType: string) => blockNode.type === nodeType) !== undefined) {
      blockNode = blockNode.parent
    } else {
      while (blockNode.type !== PROGRAM && [CLASS].find((nodeType: string) => blockNode.type === nodeType) === undefined) {
        if (blockNode.parent !== null) {
          blockNode = blockNode.parent
        }
      }
    }

    let openingEndCharacterPosition = 0
    if (blockNode.type === CLASS) {
      openingEndCharacterPosition = blockNode.child(1)?.endPosition.column || 0
    }

    return this._convertBlockNodeToRubyBlock(blockNode, openingEndCharacterPosition, text)
  }

  async getDefUnderCursorPosition(text: string, cursorPosition: vscode.Position): Promise<RubyBlock | undefined> {
    const tree = await this._analyze(text)
    const currentNode = tree.rootNode.descendantForPosition({
      row: cursorPosition.line,
      column: cursorPosition.character,
    })
    let blockNode: Parser.SyntaxNode = currentNode

    if (blockNode.parent !== null && [METHOD].find((nodeType: string) => blockNode.type === nodeType) !== undefined) {
      blockNode = blockNode.parent
    } else {
      while (blockNode.type !== PROGRAM && [METHOD].find((nodeType: string) => blockNode.type === nodeType) === undefined) {
        if (blockNode.parent !== null) {
          blockNode = blockNode.parent
        }
      }
    }

    let openingEndCharacterPosition = 0
    if (blockNode.type === METHOD) {
      const isMethodWithParams = blockNode.child(2) !== null && (blockNode.child(2)!.type === METHOD_PARAMETERS)
      openingEndCharacterPosition = blockNode.child(isMethodWithParams ? 2 : 1)?.endPosition.column || 0
    }

    return this._convertBlockNodeToRubyBlock(blockNode, openingEndCharacterPosition, text)  }

  _convertBlockNodeToRubyBlock(blockNode: Parser.SyntaxNode, openingEndCharacterPosition: number, text: string): RubyBlock {
    const isBodyInline = blockNode.startPosition.row === (blockNode.lastChild?.endPosition.row || 0)
    const openingText = text.split('\n')[blockNode.startPosition.row].substring(blockNode.startPosition.column, openingEndCharacterPosition)
    const indentationLength = text.split('\n')[blockNode.startPosition.row].length - text.split('\n')[blockNode.startPosition.row].trimStart().length
    const body = isBodyInline ? [text.split('\n')[blockNode.startPosition.row].slice(openingEndCharacterPosition, blockNode.lastChild?.startPosition.column)] : blockNode.text.split('\n').slice(1, blockNode.text.split('\n').length - 1)
    const block = {
      blockOpening: {
        startCharacterPosition: blockNode.startPosition.column,
        line: blockNode.startPosition.row,
        endCharacterPosition: openingEndCharacterPosition,
        text: openingText,
      } as RubyBlockDetails,
      blockClosing: {
        startCharacterPosition: blockNode.lastChild?.startPosition.column,
        line: blockNode.lastChild?.endPosition.row,
        endCharacterPosition: blockNode.lastChild?.endPosition.column,
        text: blockNode.lastChild?.text,
      } as RubyBlockDetails,
      body: body,
      selections: [] as vscode.Selection[],
      indentationLength: indentationLength,
    } as RubyBlock

    return block
  }

  async _analyze(text: string): Promise<Parser.Tree> {
    try {
      return this._generateTree(text)
    } catch {
      return this._generateTree(text)
    }
  }

  async _generateTree(text: string): Promise<Parser.Tree> {
    const rubyWasmPath = 'src/plugins/select_block/parsers/tree-sitter-ruby.wasm'
    const rubyLanguage = await Parser.Language.load(rubyWasmPath)
    const parser = new Parser()
    parser.setLanguage(rubyLanguage)
    return parser.parse(text)
  }
}
