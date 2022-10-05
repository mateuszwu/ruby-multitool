const CURLY_BRACKET_BLOCK_OPENING = '{';
const CURLY_BRACKET_BLOCK_CLOSING = '}';
const DO_END_BLOCK_OPENING = 'do';
const DO_END_BLOCK_CLOSING = 'end';
const CURLY_BRACKET_WITH_PARAMS = /(^\{\s*\|.*\|)/g;
const DO_END_BLOCK_WITH_PARAMS = /(^do\s*\|.*\|)/g;
const INDENTATION_LENGTH = 2;

export function changeRubyBlockSyntax(selectedText: string): string {
  if(selectedText.startsWith(CURLY_BRACKET_BLOCK_OPENING) && selectedText.endsWith(CURLY_BRACKET_BLOCK_CLOSING)) {
    return _changeCurlyBracketSyntaxToDoEndSyntax(selectedText);
  } else if (selectedText.startsWith(DO_END_BLOCK_OPENING) && selectedText.endsWith(DO_END_BLOCK_CLOSING)) {
    return _changeDoEndToCurlyBracketSyntax(selectedText);
  }

  return selectedText;
}

function _changeDoEndToCurlyBracketSyntax(selectedText: string) {
  let blockOpening = selectedText.slice(0, DO_END_BLOCK_OPENING.length);
  let blockBody = selectedText.slice(DO_END_BLOCK_OPENING.length, selectedText.length - DO_END_BLOCK_CLOSING.length);
  let blockClosing = selectedText.slice(selectedText.length - DO_END_BLOCK_CLOSING.length);

  const doEndBlockWithParamsMatch = Array.from(selectedText.matchAll(DO_END_BLOCK_WITH_PARAMS));
  if (doEndBlockWithParamsMatch.length !== 0) {
    blockOpening = selectedText.slice(0, doEndBlockWithParamsMatch[0][0].length);
    blockBody = selectedText.slice(doEndBlockWithParamsMatch[0][0].length, selectedText.length - DO_END_BLOCK_CLOSING.length);
  }

  blockOpening = blockOpening.replace(DO_END_BLOCK_OPENING, CURLY_BRACKET_BLOCK_OPENING);
  blockClosing = blockClosing.replace(DO_END_BLOCK_CLOSING, CURLY_BRACKET_BLOCK_CLOSING);

  return [
    blockOpening,
    blockBody,
    blockClosing,
  ].join('');
}

function _changeCurlyBracketSyntaxToDoEndSyntax(selectedText: string) {
  const isMultilineSelect = selectedText.split('\n').length > 1;
  let blockOpening = selectedText.slice(0, CURLY_BRACKET_BLOCK_OPENING.length);
  let blockBody = selectedText.slice(CURLY_BRACKET_BLOCK_OPENING.length, selectedText.length - CURLY_BRACKET_BLOCK_CLOSING.length);
  let blockClosing = selectedText.slice(selectedText.length - CURLY_BRACKET_BLOCK_CLOSING.length);

  const curlyBracketWithParamsMatch = Array.from(selectedText.matchAll(CURLY_BRACKET_WITH_PARAMS));
  if (curlyBracketWithParamsMatch.length !== 0) {
    blockOpening = selectedText.slice(0, curlyBracketWithParamsMatch[0][0].length);
    blockBody = selectedText.slice(curlyBracketWithParamsMatch[0][0].length, selectedText.length - CURLY_BRACKET_BLOCK_CLOSING.length);
  }

  blockOpening = blockOpening.replace(CURLY_BRACKET_BLOCK_OPENING, DO_END_BLOCK_OPENING);
  blockClosing = blockClosing.replace(CURLY_BRACKET_BLOCK_CLOSING, DO_END_BLOCK_CLOSING);

  return [
    blockOpening,
    isMultilineSelect ? blockBody : `${' '.repeat(INDENTATION_LENGTH)}${blockBody.trim()}`,
    blockClosing,
  ].join(isMultilineSelect ? '' : '\n');
}
