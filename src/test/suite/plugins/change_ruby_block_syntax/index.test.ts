import * as assert from "assert";
import { changeRubyBlockSyntax } from "../../../../plugins/change_ruby_block_syntax";

suite("#changeRubyBlockSyntax", () => {
  test(`when string is oneline with params and begins with curly bracket, it changes curly bracket syntax to 'do end' syntax`, () => {
    const selectedText = `{ |foo| foo.bar }`;

    const result = changeRubyBlockSyntax(selectedText);

    assert.equal(
      result,
      [
        'do |foo|',
        '  foo.bar',
        'end',
      ].join('\n')
    );
  });

  test(`when string is oneline without params and begins with curly bracket, it changes curly bracket syntax to 'do end' syntax`, () => {
    const selectedText = `{ foo.bar }`;

    const result = changeRubyBlockSyntax(selectedText);

    assert.equal(
      result,
      [
        'do',
        '  foo.bar',
        'end',
      ].join('\n')
    );
  });

  test(`when string is multiline with params and begins with curly bracket, it changes curly bracket syntax to 'do end' syntax`, () => {
    const selectedText = [
      `{ |foo|`,
      `  foo.bar`,
      `}`
    ].join('\n');

    const result = changeRubyBlockSyntax(selectedText);

    assert.equal(
      result,
      [
        'do |foo|',
        '  foo.bar',
        'end',
      ].join('\n')
    );
  });

  test(`when string is multiline without params and begins with curly bracket, it changes curly bracket syntax to 'do end' syntax`, () => {
    const selectedText = [
      `{`,
      `    foo.bar`,
      `  }`
    ].join('\n');

    const result = changeRubyBlockSyntax(selectedText);

    assert.equal(
      result,
      [
        'do',
        '    foo.bar',
        '  end',
      ].join('\n')
    );
  });

  test(`when string is oneline with params and begins with 'do', it changes 'do end' syntax to curly bracket syntax`, () => {
    const selectedText = 'do |foo| foo.bar end';

    const result = changeRubyBlockSyntax(selectedText);

    assert.equal(result, '{ |foo| foo.bar }');
  });

  test(`when string is oneline without params and begins with 'do', it changes 'do end' syntax to curly bracket syntax`, () => {
    const selectedText = "do foo.bar end";

    const result = changeRubyBlockSyntax(selectedText);

    assert.equal(result, "{ foo.bar }");
  });

  test(`when string is multiline with params and begins with 'do', it changes 'do end' syntax to curly bracket syntax`, () => {
    const selectedText = [
      'do |foo|',
      '  foo.bar',
      'end',
    ].join('\n');

    const result = changeRubyBlockSyntax(selectedText);

    assert.equal(
      result,
      [
        `{ |foo|`,
        `  foo.bar`,
        `}`
      ].join('\n')
    );
  });

  test(`when string is multiline without params and begins with 'do', it changes 'do end' syntax to curly bracket syntax`, () => {
    const selectedText = [
      'do',
      '  foo.bar',
      'end',
    ].join('\n');

    const result = changeRubyBlockSyntax(selectedText);

    assert.equal(
      result,
      [
        `{`,
        `  foo.bar`,
        `}`
      ].join('\n')
    );
  });

  test(`when string does NOT begin with 'do end' nor curly bracket syntas, it changes does not change anything`, () => {
    const selectedText = `[foo, bar]`;

    const result = changeRubyBlockSyntax(selectedText);

    assert.equal(result, selectedText);
  });
});
