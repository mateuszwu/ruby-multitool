// I know that this functionality is far being perfect,
// but the vast majority of day-to-day use cases are covered and are working fine.
// Please, feel free to create PR that could help eliminate weird edge cases.

const REGEXP_STRING_1 = '(:?[\'"][\\w\\d_\\s#\\{\\}]+[\'"]\\s*=>\\s?[\'"].+[\'"])' // :'foo' => 'bar' | :"foo" => "bar" | :'foo' => 'bar #{test}' | "key" => '1'
const REGEXP_STRING_2 = '(:?[\'"][\\w\\d_\\s#\\{\\}]+[\'"]\\s*=>\\s?[^\\s,\\{\\}\\[\\]\\(\\)]+)' // foo => bar | biz => 1234 | :foo => 123.1
const REGEXP_STRING_3 = '(:?[\\w\\d_]+\\s?=>\\s?[\'"].+[\'"])' // foo => 'bar' | :foo => 'bar' | foo => 'bar #{test}'
const REGEXP_STRING_4 = '(:?[\\w\\d_]+\\s?=>\\s?[^\\s,\\{\\}\\[\\]\\(\\)]+)' // :foo => 123.1 | biz => 1234
const REGEXP_STRING_5 = '([\'"][\\w\\d_\\s#\\{\\}]+[\'"]:\\s?[\'"].+[\'"])' // "key #{index}":'1' | "key #{index}":'1.0'
const REGEXP_STRING_6 = '([\'"][\\w\\d_\\s#\\{\\}]+[\'"]:\\s?[^\\s,\\{\\}\\[\\]\\(\\)]+)' // "key #{index}":value | "key #{index}": 1.0
const REGEXP_STRING_7 = '([\\w\\d_]+:\\s?[\'"].+[\'"](?!))' // key:'1' | key:"1.0"
const REGEXP_STRING_8 = '([\\w\\d_]+:\\s?[^\\s,\\{\\}\\[\\]\\(\\)]+)' // key:1 | key:value
const ALL_KEY_VALUE_REGEXP_STRINGS = [
  REGEXP_STRING_1,
  REGEXP_STRING_2,
  REGEXP_STRING_3,
  REGEXP_STRING_4,
  REGEXP_STRING_5,
  REGEXP_STRING_6,
  REGEXP_STRING_7,
  REGEXP_STRING_8,
]
const REGEXP_FLAGS = 'g'
const KEY_VALUE_REGEXP = new RegExp(`${ALL_KEY_VALUE_REGEXP_STRINGS.join('|')}`, REGEXP_FLAGS)

const REGEXP_STRING_9 = '([\\d\\w_]+):?' // foo, bar, biz:
const REGEXP_STRING_10 = '([\\d\\w_]+\\s*=\\s*\\[\\])' // foo = []
const REGEXP_STRING_11 = '([\\d\\w_]+\\s*=\\s*[\'"][\\w\\d_#\\{\\}\\s\\,]*[\'"])' // foo = "", bar='', biz = "qux"
const REGEXP_STRING_12 = '([\\d\\w_]+\\s*[=]\\s*:?[\\d\\w_]+)' // foo = 1, foo = :bar
const REGEXP_STRING_13 = '([\\d\\w_]+:\\s*:?[\\d\\w_]+)' // foo: :bar
const REGEXP_STRING_14 = '(:?[\\d\\w_]+)' // :foo, :bar
const REGEXP_STRING_ENDING = '[,\\)\\n\\]]'

const ALL_SYMBOL_ARRAY_METHOD_REGEXP_STRINGS = [
  REGEXP_STRING_9,
  REGEXP_STRING_10,
  REGEXP_STRING_11,
  REGEXP_STRING_12,
  REGEXP_STRING_13,
  REGEXP_STRING_14,
]
const SYMBOL_ARRAY_METHOD_REGEXP = new RegExp(`(${ALL_SYMBOL_ARRAY_METHOD_REGEXP_STRINGS.join('|')})${REGEXP_STRING_ENDING}`, REGEXP_FLAGS)

interface CursorPosition {
  line: number,
  character: number,
}

interface ParamsSidemoveReturn {
  text: string,
  cursorOffsetPosition: CursorPosition
}

export interface MatchedElement {
  index: number,
  input: string,
  startOfMatchedText: number,
  endOfMatchedText: number,
  matchedText: string,
  isCurrentKeyValue: boolean,
  isNextToTheRight: boolean,
  isNextToTheLeft: boolean,
}

interface MatchingFunc {
  (matchedElement: MatchedElement, cursorPosition: CursorPosition): MatchedElement
}

export default class ParamsSidemove {
  moveParamRight(text: string, cursorPosition: CursorPosition): ParamsSidemoveReturn {
    const matchedElements = this._elementsToRight(text, cursorPosition)
    const currentMatch = matchedElements.filter((x) => x.isCurrentKeyValue)[0]
    const nextMatch = matchedElements.filter((x) => x.isNextToTheRight)[0]

    if (currentMatch !== undefined && nextMatch !== undefined) {
      const newText = this._swapKeys(text, currentMatch, nextMatch)
      const newTextMatchedElements = this._elementsToRight(newText, { ...cursorPosition, character: nextMatch.endOfMatchedText })
      const newCurrentMatch = newTextMatchedElements.filter((x) => x.matchedText === currentMatch.matchedText)[0]
      const cursorPositionOffset = {
        line: 0,
        character: 0
      }
      const newTextFirstLineLength = newText.split('\n')[0].length
      if (newTextFirstLineLength < newCurrentMatch.startOfMatchedText) {
        cursorPositionOffset.line = 1
        cursorPositionOffset.character = newCurrentMatch.startOfMatchedText - currentMatch.startOfMatchedText - newTextFirstLineLength - 1
      } else {
        cursorPositionOffset.character = newCurrentMatch.startOfMatchedText - currentMatch.startOfMatchedText
      }
      return {
        text: newText,
        cursorOffsetPosition: {
          line: cursorPositionOffset.line,
          character: cursorPositionOffset.character
        },
      }
    }

    return {
      text: text,
      cursorOffsetPosition: { line: 0, character: 0 }
    }
  }

  moveParamLeft(text: string, cursorPosition: CursorPosition): ParamsSidemoveReturn {
    const linesAsArray = text.split('\n')
    if (linesAsArray.length > 2) {
      cursorPosition = {...cursorPosition, character: cursorPosition.character + linesAsArray[0].length}
    }
    const matchedElements = this._elementsToLeft(text, cursorPosition)
    const currentMatch = matchedElements.filter((x) => x.isCurrentKeyValue)[0]
    const nextMatch = matchedElements.filter((x) => x.isNextToTheLeft).reverse()[0]

    if (currentMatch !== undefined && nextMatch !== undefined) {
      const newText = this._swapKeys(text, nextMatch, currentMatch)
      const newTextMatchedElements = this._elementsToLeft(newText, { ...cursorPosition, character: nextMatch.startOfMatchedText })
      const newCurrentMatch = newTextMatchedElements.filter((x) => x.matchedText === currentMatch.matchedText)[0]
      const cursorPositionOffset = {
        line: 0,
        character: 0
      }
      const newTextFirstLineLength = newText.split('\n')[0].length
      const currentTextRegexp = (text: string, matchedText: string): RegExpMatchArray | null => (
        text.match(`[\\s,[\\(\\{]?${matchedText}[\\s,\\)\\]\\}]`)
      )
      const newTextAsArray = newText.split('\n')
      if (newTextAsArray.length > 2 && currentTextRegexp(newTextAsArray[0], currentMatch.matchedText) && currentTextRegexp(newTextAsArray[1], nextMatch.matchedText)) {
        cursorPositionOffset.line = -1
        cursorPositionOffset.character = newCurrentMatch.startOfMatchedText - currentMatch.startOfMatchedText + newTextFirstLineLength + nextMatch.matchedText.length - currentMatch.matchedText.length + 1
      } else {
        cursorPositionOffset.character = newCurrentMatch.startOfMatchedText - currentMatch.startOfMatchedText
      }

      return {
        text: newText,
        cursorOffsetPosition: {
          line: cursorPositionOffset.line,
          character: cursorPositionOffset.character
        },
      }
    }

    return {
      text: text,
      cursorOffsetPosition: { line: 0, character: 0 }
    }
  }

  _elementsToRight(text: string, cursorPosition: CursorPosition): Array<MatchedElement> {
    const keyValueMatches = this._matchedElements(text, cursorPosition, KEY_VALUE_REGEXP, this._matchedElementsToRight)
    const isCurrentMatchPresent = keyValueMatches.filter((matchedElement: MatchedElement) => matchedElement.isCurrentKeyValue).length > 0
    if (isCurrentMatchPresent) {
      return keyValueMatches
    }

    return this._matchedElements(text, cursorPosition, SYMBOL_ARRAY_METHOD_REGEXP, this._matchedElementsToRight)
  }

  _matchedElementsToRight(matchedElement: MatchedElement, cursorPosition: CursorPosition): MatchedElement {
    if (matchedElement.startOfMatchedText <= cursorPosition.character && cursorPosition.character <= matchedElement.endOfMatchedText) {
      return ({...matchedElement, isCurrentKeyValue: true} as MatchedElement)
    } else if (cursorPosition.character <= matchedElement.startOfMatchedText) {
      return ({...matchedElement, isNextToTheRight: true} as MatchedElement)
    }

    return matchedElement
  }

  _elementsToLeft(text: string, cursorPosition: CursorPosition): Array<MatchedElement> {
    const keyValueMatches = this._matchedElements(text, cursorPosition, KEY_VALUE_REGEXP, this._matchedElementsToLeft)
    const isCurrentMatchPresent = keyValueMatches.filter((matchedElement: MatchedElement) => matchedElement.isCurrentKeyValue).length > 0
    if (isCurrentMatchPresent) {
      return keyValueMatches
    }

    return this._matchedElements(text, cursorPosition, SYMBOL_ARRAY_METHOD_REGEXP, this._matchedElementsToLeft)
  }

  _matchedElementsToLeft(matchedElement: MatchedElement, cursorPosition: CursorPosition): MatchedElement {
    if (matchedElement.startOfMatchedText <= cursorPosition.character + 1 && cursorPosition.character <= matchedElement.endOfMatchedText) {
      return({...matchedElement, isCurrentKeyValue: true} as MatchedElement)
    } else if (cursorPosition.character >= matchedElement.startOfMatchedText) {
      return({...matchedElement, isNextToTheLeft: true} as MatchedElement)
    }

    return matchedElement
  }

  _matchedElements(text: string, cursorPosition: CursorPosition, regexp: RegExp, matchingFunc: MatchingFunc): Array<MatchedElement> {
    return Array.from(text.matchAll(regexp)).map(
      (regexMatchedElement: any): MatchedElement => {
        const matchedElement = {
          isCurrentKeyValue: false,
          isNextToTheRight: false,
          isNextToTheLeft: false,
        } as MatchedElement

        for (let index = 1; index <= 20; index++) {
          if (regexMatchedElement[index] !== undefined) {
            matchedElement.matchedText = regexMatchedElement[index]
            break
          }
        }

        if (matchedElement.matchedText === undefined) {
          return matchedElement
        }

        matchedElement.startOfMatchedText = regexMatchedElement.index
        if (text[matchedElement.startOfMatchedText - 1] === ':') {
          matchedElement.startOfMatchedText--
        }
        matchedElement.endOfMatchedText =
          matchedElement.startOfMatchedText + matchedElement.matchedText.length

        return matchingFunc(matchedElement, cursorPosition)
      }
    )
  }

  _swapKeys = (text: string, matchElement1: MatchedElement, matchElement2: MatchedElement) => {
    const textBeforeMatchElement1 = text.substring(0, matchElement1.startOfMatchedText)
    const textBetweenmatchElement1AndmatchElement2 = text.substring(
      matchElement1.startOfMatchedText + matchElement1.matchedText.length,
      matchElement2.startOfMatchedText
    )
    const textAfterMatchElement2 = text.substring(
      matchElement2.startOfMatchedText + matchElement2.matchedText.length,
      text.length
    )

    return `${textBeforeMatchElement1}${matchElement2.matchedText}${textBetweenmatchElement1AndmatchElement2}${matchElement1.matchedText}${textAfterMatchElement2}`
  }
}

