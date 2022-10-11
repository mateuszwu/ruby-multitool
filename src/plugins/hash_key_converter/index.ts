const REGURAL_HASH_ROCKET_SYNTAX_REGEXP = new RegExp(/(:['"]?([\w\d_]+)['"]?\s*=>\s*|:?['"]([\w\d_]+)['"]\s*=>\s*)/g)
const FANCY_HASH_ROCKET_SYNTAX_REGEXP = new RegExp(/(:?(['"][\w\d_#{}\s]+["'])\s*=>\s*)/g)
const NEW_HASH_SYNTAX_REGEXP = new RegExp(/(['"]?([\w\d_]+)['"]?:\s+)/g)

export default class HashKeyConverter {
  convertSingleKey(lineText: string, cursorPosition: number): string {
    return (
      this._convertRegularHashRocketKey(lineText, cursorPosition) ||
        this._convertFancyHashRocketKey(lineText, cursorPosition) ||
        this._convertNewHashRocketKey(lineText, cursorPosition) ||
        lineText
    )
  }

  convertAllKeys(text: string): string {
    let newText = this._convertAllKeysToNewSyntax(text)
    if (newText === text) {
      newText = this._convertAllKeysToOldSyntax(text)
    }

    return newText
  }

  _convertAllKeysToNewSyntax(text: string): string {
    return this._splitTextToFragmentsAndConvert(text, (fragment: string): string | undefined => {
      return this._convertRegularHashRocketKey(fragment, 0, true) || this._convertFancyHashRocketKey(fragment, 0, true)
    })
  }

  _convertAllKeysToOldSyntax(text: string): string {
    return this._splitTextToFragmentsAndConvert(text, (fragment: string): string | undefined => {
      return this._convertNewHashRocketKey(fragment, 0, true)
    })
  }

  _splitTextToFragmentsAndConvert(text: string, convert: (fragment: string) => string | undefined): string {
    return text.split('\n').map((line: string): string => {
      return line.split(',').map((fragment: string): string => {
        return convert(fragment) || fragment
      }).join(',')
    }).join('\n')
  }

  _convertHashKey(lineText: string, cursorPosition: number, regexp: RegExp, keyTransformation: (key: string) => string, skipCursorPositionCheck = false): string | undefined {
    const matches = Array
      .from(lineText.matchAll(regexp))
      .map((matchedElement: any) => {
        if (skipCursorPositionCheck) {
          matchedElement.isCursorInMatchedWord = true
        } else {
          const wordUnderTheCursor = matchedElement[2] || matchedElement[3]
          let startOfTheWordPosition = lineText.indexOf(wordUnderTheCursor)
          if (lineText[startOfTheWordPosition - 1] === ':') {
            startOfTheWordPosition--
          }
          const endOfTheWordPosition = startOfTheWordPosition + wordUnderTheCursor.length
          matchedElement.isCursorInMatchedWord = startOfTheWordPosition <= cursorPosition &&
            cursorPosition <= endOfTheWordPosition
        }

        return matchedElement
      })
      .filter((x) => x.isCursorInMatchedWord)
    const bestMatch = matches[0]

    if (bestMatch !== undefined) {
      const oldKeySyntax = bestMatch[1]
      const key = bestMatch[2] || bestMatch[3]

      return lineText.replace(oldKeySyntax, keyTransformation(key))
    }
  }

  _convertRegularHashRocketKey(lineText: string, cursorPosition: number, skipCursorPositionCheck = false): string | undefined {
    return this._convertHashKey(
      lineText,
      cursorPosition,
      REGURAL_HASH_ROCKET_SYNTAX_REGEXP,
      (key: string): string => `${key}: `,
      skipCursorPositionCheck
    )
  }

  _convertFancyHashRocketKey(lineText: string, cursorPosition: number, skipCursorPositionCheck = false): string | undefined {
    return this._convertHashKey(
      lineText,
      cursorPosition,
      FANCY_HASH_ROCKET_SYNTAX_REGEXP,
      (key: string): string => `${key}: `,
      skipCursorPositionCheck
    )
  }

  _convertNewHashRocketKey(lineText: string, cursorPosition: number, skipCursorPositionCheck = false): string | undefined {
    return this._convertHashKey(
      lineText,
      cursorPosition,
      NEW_HASH_SYNTAX_REGEXP,
      (key: string): string => `'${key}' => `,
      skipCursorPositionCheck
    )
  }
}
