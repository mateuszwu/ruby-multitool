export function foldAllDescribes(text: string): number[] {
  return _linesToFold(text, 'describe')
}

export function foldAllContexts(text: string): number[] {
  return _linesToFold(text, 'context')
}

export function foldAllIts(text: string): number[] {
  return _linesToFold(text, 'it')
}

function _linesToFold(text: string, contextName: string): number[] {
  return text
    .split('\n')
    .map((line: string, index: number): number =>
      line.trimStart().startsWith(contextName) ? index : -1
    )
    .filter((lineNumber: number) => lineNumber !== -1)
}
