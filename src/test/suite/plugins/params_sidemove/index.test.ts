import * as assert from "assert";
import ParamsSidemove from "../../../../plugins/params_sidemove";

suite("#moveRight", () => {
  [
    {
      actualValue: "{ :foo => 'value', }",
      expectedValue: "{ :foo => 'value', }",
      actualCursorPosition: { line: 0, character: 4 },
      expectedCursorPositionChange: { line: 0, character: 0 },
    },
    {
      actualValue: '{ :"foo" => value, :"bar" => value1 }',
      expectedValue: '{ :"bar" => value1, :"foo" => value }',
      actualCursorPosition: { line: 0, character: 4 },
      expectedCursorPositionChange: { line: 0, character: 18 },
    },
    {
      actualValue: '{ biz: 123, :"foo" => value, arr: [1], :"bar" => value1 }',
      expectedValue:
        '{ biz: 123, :"bar" => value1, arr: [1], :"foo" => value }',
      actualCursorPosition: { line: 0, character: 14 },
      expectedCursorPositionChange: { line: 0, character: 28 },
    },
    {
      actualValue:
        '{ biz: 123, :"foo" => value, arr: [1],\nnst_hsh: { fiz: "999" }, :"bar" => value1 }\n',
      expectedValue:
        '{ biz: 123, fiz: "999", arr: [1],\nnst_hsh: { :"foo" => value }, :"bar" => value1 }\n',
      actualCursorPosition: { line: 0, character: 14 },
      expectedCursorPositionChange: { line: 1, character: -1 },
    },
    {
      actualValue: "attr_reader :foo, :bar,\n:baz, :qux",
      expectedValue: "attr_reader :foo, :baz,\n:bar, :qux",
      actualCursorPosition: { line: 0, character: 20 },
      expectedCursorPositionChange: { line: 1, character: -18 },
    },
    {
      actualValue: `let(:challenger) { create(:player, :in_game, reference: 'Alures', game: game, as_user: 'AluresUser') }`,
      expectedValue: `let(:challenger) { create(:in_game, :player, reference: 'Alures', game: game, as_user: 'AluresUser') }`,
      actualCursorPosition: { line: 0, character: 28 },
      expectedCursorPositionChange: { line: 0, character: 10 },
    },
    {
      actualValue: `def method(test = 1, test2 = [], test3 = "", test4='', test5: :abc)`,
      expectedValue: `def method(test2 = [], test = 1, test3 = "", test4='', test5: :abc)`,
      actualCursorPosition: { line: 0, character: 11 },
      expectedCursorPositionChange: { line: 0, character: 12 },
    },
    {
      actualValue: `def method(test = 1, test2 = [], test3 = "", test4='', test5: :abc)`,
      expectedValue: `def method(test = 1, test3 = "", test2 = [], test4='', test5: :abc)`,
      actualCursorPosition: { line: 0, character: 21 },
      expectedCursorPositionChange: { line: 0, character: 12 },
    },
    {
      actualValue: `def method(test = 1, test2 = [], test3 = "", test4='', test5: :abc)`,
      expectedValue: `def method(test = 1, test2 = [], test4='', test3 = "", test5: :abc)`,
      actualCursorPosition: { line: 0, character: 33 },
      expectedCursorPositionChange: { line: 0, character: 10 },
    },
    {
      actualValue: `def method(test = 1, test2 = [], test3 = "", test4='', test5: :abc)`,
      expectedValue: `def method(test = 1, test2 = [], test3 = "", test5: :abc, test4='')`,
      actualCursorPosition: { line: 0, character: 47 },
      expectedCursorPositionChange: { line: 0, character: 13 },
    },
    {
      actualValue: `[test, test2, test3]`,
      expectedValue: `[test2, test, test3]`,
      actualCursorPosition: { line: 0, character: 1 },
      expectedCursorPositionChange: { line: 0, character: 7 },
    },
    {
      actualValue: `[1, 2, 3, 4, 5, 6]`,
      expectedValue: `[1, 2, 3, 4, 6, 5]`,
      actualCursorPosition: { line: 0, character: 13 },
      expectedCursorPositionChange: { line: 0, character: 3 },
    },
    {
      actualValue: `def initialize(game:, player_id:, history_page:, participants_page:) `,
      expectedValue: `def initialize(player_id:, game:, history_page:, participants_page:) `,
      actualCursorPosition: { line: 0, character: 16 },
      expectedCursorPositionChange: { line: 0, character: 12 },
    },
  ].forEach(
    ({
      actualValue,
      expectedValue,
      actualCursorPosition,
      expectedCursorPositionChange,
    }) => {
      test(`Convert ${actualValue} to: ${expectedValue} and change cursor position by { line: ${expectedCursorPositionChange.line}, character: ${expectedCursorPositionChange.character} }`, () => {
        let { text: result, cursorOffsetPosition } =
          new ParamsSidemove().moveRight(actualValue, actualCursorPosition);

        assert(result === expectedValue, `${result} === ${expectedValue}`);
        assert(
          cursorOffsetPosition.line === expectedCursorPositionChange.line,
          `line: ${cursorOffsetPosition.line} === ${expectedCursorPositionChange.line}`
        );
        assert(
          cursorOffsetPosition.character ===
            expectedCursorPositionChange.character,
          `character: ${cursorOffsetPosition.character} === ${expectedCursorPositionChange.character}`
        );
      });
    }
  );
});

suite("#moveLeft", () => {
  [
    {
      actualValue: "{ :foo => 'value', }",
      expectedValue: "{ :foo => 'value', }",
      actualCursorPosition: { line: 0, character: 4 },
      expectedCursorPositionChange: { line: 0, character: 0 },
    },
    {
      actualValue: '{ :"foo" => value, :"bar" => value1 }',
      expectedValue: '{ :"bar" => value1, :"foo" => value }',
      actualCursorPosition: { line: 0, character: 21 },
      expectedCursorPositionChange: { line: 0, character: -17 },
    },
    {
      actualValue: '{ biz: 123, :"foo" => value, arr: [1], :"bar" => value1 }',
      expectedValue:
        '{ biz: 123, :"bar" => value1, arr: [1], :"foo" => value }',
      actualCursorPosition: { line: 0, character: 42 },
      expectedCursorPositionChange: { line: 0, character: -27 },
    },
    {
      actualValue: `{ biz: 123, fiz: "999", arr: [1],\nnst_hsh: { :"foo" => value }, :"bar" => value1 }\n`,
      expectedValue: `{ biz: 123, :"foo" => value, arr: [1],\nnst_hsh: { fiz: "999" }, :"bar" => value1 }\n`,
      actualCursorPosition: { line: 1, character: 14 },
      expectedCursorPositionChange: { line: -1, character: 1 },
    },
    {
      actualValue: `attr_reader :foo, :baz,\n:bar, :qux\n`,
      expectedValue: `attr_reader :foo, :bar,\n:baz, :qux\n`,
      actualCursorPosition: { line: 0, character: 1 },
      expectedCursorPositionChange: { line: -1, character: 18 },
    },
    {
      actualValue: `let(:challenger) { create(:in_game, :player, reference: 'Alures', game: game, as_user: 'AluresUser') }`,
      expectedValue: `let(:challenger) { create(:player, :in_game, reference: 'Alures', game: game, as_user: 'AluresUser') }`,
      actualCursorPosition: { line: 0, character: 38 },
      expectedCursorPositionChange: { line: 0, character: -10 },
    },
    {
      actualValue: `def method(test2 = [], test = 1, test3 = "", test4='', test5: :abc)`,
      expectedValue: `def method(test = 1, test2 = [], test3 = "", test4='', test5: :abc)`,
      actualCursorPosition: { line: 0, character: 24 },
      expectedCursorPositionChange: { line: 0, character: -12 },
    },
    {
      actualValue: `def method(test = 1, test3 = "", test2 = [], test4='', test5: :abc)`,
      expectedValue: `def method(test = 1, test2 = [], test3 = "", test4='', test5: :abc)`,
      actualCursorPosition: { line: 0, character: 34 },
      expectedCursorPositionChange: { line: 0, character: -12 },
    },
    {
      actualValue: `def method(test = 1, test2 = [], test4='', test3 = "", test5: :abc)`,
      expectedValue: `def method(test = 1, test2 = [], test3 = "", test4='', test5: :abc)`,
      actualCursorPosition: { line: 0, character: 44 },
      expectedCursorPositionChange: { line: 0, character: -10 },
    },
    {
      actualValue: `def method(test = 1, test2 = [], test3 = "", test5: :abc, test4='')`,
      expectedValue: `def method(test = 1, test2 = [], test3 = "", test4='', test5: :abc)`,
      actualCursorPosition: { line: 0, character: 59 },
      expectedCursorPositionChange: { line: 0, character: -13 },
    },
    {
      actualValue: `[test2, test, test3]`,
      expectedValue: `[test, test2, test3]`,
      actualCursorPosition: { line: 0, character: 9 },
      expectedCursorPositionChange: { line: 0, character: -7 },
    },
    {
      actualValue: `\n[1, 2, 3, 4, 5, 6]\n`,
      expectedValue: `\n[1, 2, 3, 4, 6, 5]\n`,
      actualCursorPosition: { line: 0, character: 16 },
      expectedCursorPositionChange: { line: 0, character: -3 },
    },
    {
      actualValue: `def initialize(player_id:, game:, history_page:, participants_page:) `,
      expectedValue: `def initialize(game:, player_id:, history_page:, participants_page:) `,
      actualCursorPosition: { line: 0, character: 28 },
      expectedCursorPositionChange: { line: 0, character: -12 },
    },
  ].forEach(
    ({
      actualValue,
      expectedValue,
      actualCursorPosition,
      expectedCursorPositionChange,
    }) => {
      test(`Convert ${actualValue} to: ${expectedValue} and change cursor position by { line: ${expectedCursorPositionChange.line}, character: ${expectedCursorPositionChange.character} }`, () => {
        let { text: result, cursorOffsetPosition } =
          new ParamsSidemove().moveLeft(actualValue, actualCursorPosition);

        assert(
          result === expectedValue,
          `Received: ${result}\nExpected: ${expectedValue}`
        );
        assert(
          cursorOffsetPosition.line === expectedCursorPositionChange.line,
          `Line received: ${cursorOffsetPosition.line}\n Line expected: ${expectedCursorPositionChange.line}`
        );
        assert(
          cursorOffsetPosition.character ===
            expectedCursorPositionChange.character,
          `Character received: ${cursorOffsetPosition.character}\n Character expected: ${expectedCursorPositionChange.character}`
        );
      });
    }
  );
});
