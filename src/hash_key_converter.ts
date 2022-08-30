const REGURAL_HASH_ROCKET_SYNTAX_REGEXP = new RegExp(/(:['"]?([\w\d_]+)['"]?\s*=>\s*|:?['"]([\w\d_]+)['"]\s*=>\s*)/g);
const FANCY_HASH_ROCKET_SYNTAX_REGEXP = new RegExp(/(:?(['"][\w\d_#\{\}\s]+["'])\s*=>\s*)/g);
const NEW_HASH_SYNTAX_REGEXP = new RegExp(/(['"]?([\w\d_]+)['"]?:\s+)/g);

export class HashKeyConverter {
  convertSingleKey(lineText: string, cursorPosition: number): string {
    return (
      this._convertRegularHashRocketKey(lineText, cursorPosition) ||
        this._convertFancyHashRocketKey(lineText, cursorPosition) ||
        this._convertNewHashRocketKey(lineText, cursorPosition) ||
        lineText
    );
  }

  _convertHashKey(lineText: string, cursorPosition: number, regexp: RegExp, keyTransformation: Function): string | undefined {
    let matches = Array
      .from(lineText.matchAll(regexp))
      .map((matchedElement: any) => {
        let wordUnderTheCursor = matchedElement[2] || matchedElement[3];
        let startOfTheWordPosition = lineText.indexOf(wordUnderTheCursor);
        if (lineText[startOfTheWordPosition - 1] === ':') {
          startOfTheWordPosition--;
        }
        let endOfTheWordPosition = startOfTheWordPosition + wordUnderTheCursor.length;
        matchedElement.isCursorInMatchedWord = startOfTheWordPosition <= cursorPosition &&
          cursorPosition <= endOfTheWordPosition;

        return matchedElement;
      })
      .filter((x) => x.isCursorInMatchedWord);
    let bestMatch = matches[0];

    if (bestMatch !== undefined) {
      let oldKeySyntax = bestMatch[1];
      let key = bestMatch[2] || bestMatch[3];

      return lineText.replace(oldKeySyntax, keyTransformation(key));
    }
  }

  _convertRegularHashRocketKey(lineText: string, cursorPosition: number): string | undefined {
    return this._convertHashKey(
      lineText,
      cursorPosition,
      REGURAL_HASH_ROCKET_SYNTAX_REGEXP,
      (key: string): string => `${key}: `
    );
  }

  _convertFancyHashRocketKey(lineText: string, cursorPosition: number): string | undefined {
    return this._convertHashKey(
      lineText,
      cursorPosition,
      FANCY_HASH_ROCKET_SYNTAX_REGEXP,
      (key: string): string => `${key}: `
    );
  }

  _convertNewHashRocketKey(lineText: string, cursorPosition: number): string | undefined {
    return this._convertHashKey(
      lineText,
      cursorPosition,
      NEW_HASH_SYNTAX_REGEXP,
      (key: string): string => `:${key} => `
    );
  }
}
