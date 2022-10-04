import * as vscode from "vscode";

const INDENTATION_REGEXP = `(^\\s*)(.*=\\s*)?`;
const BLOCK_MODULE_REGEXP = `module\\s*[\\w\\d:]+`;
const BLOCK_CLASS_REGEXP = `class\\s*[\\w\\d:]+`;
const BLOCK_DEF_REGEXP = `def\\s*[\\(,\\w\\d:\\);]+`;
const BLOCK_IF_REGEXP = `if[^\\w].*;|if[^\\w].*|if[^\\w].*;|if[^\\w].*`;
const BLOCK_UNLESS_REGEXP = `unless[^\\w].*;|unless[^\\w].*|unless[^\\w].*;|unless[^\\w].*`;
const BLOCK_WHILE_REGEXP = `while[^\\w].*;|while[^\\w].*`;
const BLOCK_FOR_REGEXP = `for[^\\w].*;|for[^\\w].*`;
const BLOCK_DO_REGEXP = `.*do[^\\w]\\s*\\|.*\\||.*do$`;
const BLOCK_CASE_REGEXP = `case[^\\w].*;|case[^\\w].*|case[^\\w].*;|case[^\\w].*`;
const BLOCK_BEGIN_REGEXP = `begin[^\\w]*`;
const ALL_BLOCK_REGEXP = [
  BLOCK_MODULE_REGEXP,
  BLOCK_CLASS_REGEXP,
  BLOCK_DEF_REGEXP,
  BLOCK_IF_REGEXP,
  BLOCK_UNLESS_REGEXP,
  BLOCK_WHILE_REGEXP,
  BLOCK_FOR_REGEXP,
  BLOCK_DO_REGEXP,
  BLOCK_CASE_REGEXP,
  BLOCK_BEGIN_REGEXP,
];
const BLOCK_OPENING_REGEXP = new RegExp(`${INDENTATION_REGEXP}(${ALL_BLOCK_REGEXP.join("|")})`, "g");
const SUPPORT_DO_REGEXP = /(^\s*.*)(?:do)$/g;
const BLOCK_CLOSING_TEXT = "end";
const BLOCK_CLOSING_REGEXP = /(end$|end\s*(if|unless))/g;

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

export class RubyFileAnalyzer {
  getBlockUnderCursorPosition(text: string, cursorPosition: vscode.Position): RubyBlock | undefined {
    const lines = text.split("\n");
    const blocks = this._analyze(lines);

    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];

      if (this._isCursorInsideTheBlock(cursorPosition, block)) {
        return block;
      }
    }
  }
  getClassUnderCursorPosition(text: string, cursorPosition: vscode.Position): RubyBlock | undefined {
    const lines = text.split("\n");
    const blocks = this._analyze(lines);

    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];

      if (this._isCursorInsideTheClass(cursorPosition, block)) {
        return block;
      }
    }
  }

  getDefUnderCursorPosition(text: string, cursorPosition: vscode.Position): RubyBlock | undefined {
    const lines = text.split("\n");
    const blocks = this._analyze(lines);

    for (let i = blocks.length - 1; i >= 0; i--) {
      const block = blocks[i];

      if (this._isCursorInsideTheDef(cursorPosition, block)) {
        return block;
      }
    }
  }

  _analyze(lines: string[]): RubyBlock[] {
    const blocks: RubyBlock[] = [];

    lines.forEach((line: string, index: number): void => {
      const blockOpeningMatchArray = this._getBlockOpeningMatchArray(line);
      if (blockOpeningMatchArray.length !== 0) {
        const rubyBlock = this._initRubyBlockWithIndentationAndOpening(line, index, blockOpeningMatchArray);
        const blockClosingMatchArray = this._getBlockClosingMatchArray(line);
        const blockClosingStartCharacterPosition = this._getBlockClosingStartCharacterPosition(blockClosingMatchArray, rubyBlock.blockOpening);

        if (blockClosingStartCharacterPosition !== undefined) {
          this._addInlineBlockClosingToRubyBlock(rubyBlock, blockClosingStartCharacterPosition, line, index);
        } else {
          this._addMultilineBlockClosingToRubyBlock(rubyBlock, lines, index);
        }
        blocks.push(rubyBlock);
      }
    });

    return blocks;
  }

  _getBlockOpeningMatchArray(line: string): RegExpMatchArray[] {
    return Array.from(line.matchAll(BLOCK_OPENING_REGEXP));
  }

  _getBlockClosingMatchArray(line: string): RegExpMatchArray[] {
    return Array.from(line.matchAll(BLOCK_CLOSING_REGEXP));
  }

  _getBlockClosingStartCharacterPosition(blockClosingMatchArray: RegExpMatchArray[], blockOpening: RubyBlockDetails): RegExpMatchArray | undefined {
    return blockClosingMatchArray.find((match: RegExpMatchArray): boolean => (match.index || -1) > blockOpening.endCharacterPosition);
  }

  _initRubyBlockWithIndentationAndOpening(line: string, index: number, blockOpening: RegExpMatchArray[]): RubyBlock {
    let enhancedBlockOpening = blockOpening;
    const doBlockMatchArray = Array.from(line.matchAll(SUPPORT_DO_REGEXP));
    if (doBlockMatchArray.length !== 0) {
      enhancedBlockOpening = doBlockMatchArray;
    }
    return {
      indentationLength: blockOpening[0][1].length,
      blockOpening: {
        text: blockOpening[0][3],
        line: index,
        startCharacterPosition: enhancedBlockOpening[0][1].length + (enhancedBlockOpening[0][2]?.length || 0),
        endCharacterPosition: blockOpening[0][1].length + (blockOpening[0][2]?.length || 0) + blockOpening[0][3].length,
      } as RubyBlockDetails,
      body: [],
      blockClosing: {} as RubyBlockDetails,
      selections: [] as vscode.Selection[]
    };
  }

  _addInlineBlockClosingToRubyBlock(rubyBlock: RubyBlock, blockClosingStartCharacterPosition: RegExpMatchArray, line: string, index: number): void {
    rubyBlock.blockClosing.text = BLOCK_CLOSING_TEXT;
    rubyBlock.blockClosing.startCharacterPosition = blockClosingStartCharacterPosition.index || 0;
    rubyBlock.blockClosing.endCharacterPosition = blockClosingStartCharacterPosition.index || 0 + rubyBlock.blockClosing.text.length;
    rubyBlock.blockClosing.line = index;
    rubyBlock.body.push(
      line.substring(
        rubyBlock.blockOpening.endCharacterPosition,
        rubyBlock.blockClosing.startCharacterPosition
      )
    );
  }

  _addMultilineBlockClosingToRubyBlock(rubyBlock: RubyBlock, lines: string[], index: number): void {
    let blockOpeningsCount = 0;

    for (let i = index; i < lines.length; i++) {
      const line = lines[i];
      if (line.match(BLOCK_OPENING_REGEXP) !== null) {
        blockOpeningsCount += 1;
      }

      const blockClosingMatchArray = this._getBlockClosingMatchArray(line);
      const blockClosingStartCharacterPosition = blockClosingMatchArray.find((match: RegExpMatchArray) => match.index !== -1);
      if (blockClosingStartCharacterPosition !== undefined) {
        blockOpeningsCount -= 1;
      }

      if (i > index && blockOpeningsCount > 0) {
        rubyBlock.body.push(line);
      }

      if (blockOpeningsCount === 0 && blockClosingStartCharacterPosition !== undefined) {
        rubyBlock.blockClosing.text = BLOCK_CLOSING_TEXT;
        rubyBlock.blockClosing.line = i;
        rubyBlock.blockClosing.startCharacterPosition = blockClosingStartCharacterPosition.index || 0;
        rubyBlock.blockClosing.endCharacterPosition = rubyBlock.blockClosing.startCharacterPosition + rubyBlock.blockClosing.text.length;

        return;
      }
    }
  }

  _isCursorInsideTheBlock(cursorPosition: vscode.Position, block: RubyBlock): boolean {
    return (
      (
        block.blockOpening.line === block.blockClosing.line &&
        block.blockOpening.line === cursorPosition.line &&
        block.blockOpening.startCharacterPosition <= cursorPosition.character &&
        cursorPosition.character <= block.blockClosing.endCharacterPosition
      ) || (
        block.blockOpening.line <= cursorPosition.line &&
        cursorPosition.line <= block.blockClosing.line
      )
    );
  }

  _isCursorInsideTheDef(cursorPosition: vscode.Position, block: RubyBlock) {
    return (
      this._isCursorInsideTheBlock(cursorPosition, block) &&
      block.blockOpening.text.match(BLOCK_DEF_REGEXP) !== null
    );
  }

  _isCursorInsideTheClass(cursorPosition: vscode.Position, block: RubyBlock) {
    return (
      this._isCursorInsideTheBlock(cursorPosition, block) &&
      block.blockOpening.text.match(BLOCK_CLASS_REGEXP) !== null
    );
  }
}
