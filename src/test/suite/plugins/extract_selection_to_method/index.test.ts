import * as assert from 'assert'
import * as vscode from 'vscode'
import {
  extractSelectionToPrivateMethod,
} from '../../../../plugins/extract_selection_to_method'

suite('#extractSelectionToPrivateMethod', () => {
  test('extracts selected oneline text to a new private method', async () => {
    const fileText = [
      'class DummyClass',
      '  def foo',
      '    \'baz\'',
      '  end',
      'end',
    ].join('\n')
    const selectedText = '\'baz\''
    const cursorPosition = new vscode.Position(2, 0)
    const extensionPath = '.'

    const result = await extractSelectionToPrivateMethod(fileText, cursorPosition, selectedText, extensionPath)

    assert.equal(
      result?.body.join('\n'),
      [
        '  def foo',
        '    change_me!',
        '  end',
        '',
        '  private',
        '',
        '  def change_me!',
        '    \'baz\'',
        '  end'
      ].join('\n'),
    )
  })

  test('extracts selected multiline text to a new private method', async () => {
    const fileText = [
      'class DummyClass',
      '  def foo(qui)',
      '    if qui',
      '      \'baz\'',
      '    else',
      '      fiz',
      '    end',
      '  end',
      'end',
    ].join('\n')
    const selectedText = [
      'if qui',
      '      \'baz\'',
      '    else',
      '      fiz',
      '    end',
    ].join('\n')
    const cursorPosition = new vscode.Position(2, 0)
    const extensionPath = '.'

    const result = await extractSelectionToPrivateMethod(fileText, cursorPosition, selectedText, extensionPath)

    assert.equal(
      result?.body.join('\n'),
      [
        '  def foo(qui)',
        '    change_me!',
        '  end',
        '',
        '  private',
        '',
        '  def change_me!',
        '    if qui',
        '      \'baz\'',
        '    else',
        '      fiz',
        '    end',
        '  end',
      ].join('\n')
    )
  })
})
