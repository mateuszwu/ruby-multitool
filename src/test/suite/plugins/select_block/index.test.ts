import * as assert from "assert";
import { RubyFileAnalyzer } from "../../../../plugins/select_block";
import * as fse from "fs-extra";
import * as vscode from "vscode";

suite("#getBlockUnderCursorPosition", () => {
  test(`returns a top 'module' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(0, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 0, 'Indentation');
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 10,
      line: 0,
      startCharacterPosition: 0,
      text: "module Foo",
    });
    assert.equal(result?.body.length, 69, 'Body length');
    assert.equal(result?.body[0], "  module Bar::Kaz");
  });

  test(`returns a nested 'module' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(1, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 2, 'Indentation');
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 17,
      line: 1,
      startCharacterPosition: 2,
      text: "module Bar::Kaz"
    });
    assert.equal(result?.body.length, 67, 'Body length');
    assert.equal(result?.body[0], "    class Fiz");
  });

  test(`returns 'class' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(2, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 4, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 13,
      line: 2,
      startCharacterPosition: 4,
      text: "class Fiz"
    });
    assert.equal(result?.body.length, 58, 'Body length');
    assert.equal(result?.body[0], "      def qui");
  });

  test(`returns multiline 'def' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(3, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 6, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 13,
      line: 3,
      startCharacterPosition: 6,
      text: "def qui",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], "        111");
  });

  test(`returns inline 'def' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(7, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 6, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 21,
      line: 7,
      startCharacterPosition: 6,
      text: "def uis(a,b,c);",
    });
    assert.equal(result?.body.length, 1, 'Body length');
    assert.equal(result?.body[0], " 5 ");
  });

  test(`returns inline 'if' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(10, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 16,
      line: 10,
      startCharacterPosition: 8,
      text: "if true;",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], " 222 ");
  });

  test(`returns multiline 'if' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(11, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 17,
      line: 11,
      startCharacterPosition: 8,
      text: "if 4 == 4",
    });
    assert.equal(result?.body.length, 5, "Body length");
    assert.equal(result?.body[0], "          555");
  });

  test(`returns inline 'unless' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(13, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 10, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 23,
      line: 13,
      startCharacterPosition: 10,
      text: "unless false;",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], " 666 ");
  });

  test(`returns multiline 'unless' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(14, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 10, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 23,
      line: 14,
      startCharacterPosition: 10,
      text: "unless 6 == 5",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], "            777");
  });

  test(`returns inline 'if' with body (variable assign)`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(19, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 27,
      line: 19,
      startCharacterPosition: 15,
      text: "if 920==210;",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], " 29384 else 1920 ");
  });

  test(`returns inline 'unless' with body (variable assign)`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(20, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 31,
      line: 20,
      startCharacterPosition: 15,
      text: "unless 920==210;",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], " 29384 else 1920 ");
  });

  test(`returns multiline 'if' with body (variable assign)`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(21, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 25,
      line: 21,
      startCharacterPosition: 14,
      text: "if 920==210",
    });
    assert.equal(result?.body.length, 3, "Body length");
    assert.equal(result?.body[0], "          3891");
  });

  test(`returns multiline 'unless' with body (variable assign)`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(26, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 30,
      line: 26,
      startCharacterPosition: 15,
      text: "unless 920==210",
    });
    assert.equal(result?.body.length, 3, "Body length");
    assert.equal(result?.body[0], "          3899");
  });

  test(`returns 'while' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(31, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 18,
      line: 31,
      startCharacterPosition: 8,
      text: "while 8==8",
    });
    assert.equal(result?.body.length, 4, "Body length");
    assert.equal(result?.body[0], "          for i in 1..10");
  });

  test(`returns 'for' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(32, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 10, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 24,
      line: 32,
      startCharacterPosition: 10,
      text: "for i in 1..10",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], "            break");
  });

  test(`returns multiline 'do' block with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(38, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 17,
      line: 38,
      startCharacterPosition: 15,
      text: "[].map do",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], "          '888'");
  });

  test(`returns inline 'do' block with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(41, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 21,
      line: 41,
      startCharacterPosition: 8,
      text: "[].map do |x|",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], " x ");
  });

  test(`returns multiline 'case' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(43, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 17,
      line: 43,
      startCharacterPosition: 8,
      text: "case 9==9",
    });
    assert.equal(result?.body.length, 2, "Body length");
    assert.equal(result?.body[0], "        when true then 1000");
  });

  test(`returns multiline 'case' with body (variable assign)`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(48, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 24,
      line: 48,
      startCharacterPosition: 15,
      text: "case 9==9",
    });
    assert.equal(result?.body.length, 2, "Body length");
    assert.equal(result?.body[0], "        when true then 1000");
  });

  test(`returns inline 'case' with body (variable assign)`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(53, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 30,
      line: 53,
      startCharacterPosition: 16,
      text: "case 192==483;",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], " when 192==483 then 18932 ");
  });

  test(`returns inline 'case' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(55, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 26,
      line: 55,
      startCharacterPosition: 8,
      text: "case 10923==23841;",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], " when 10923==23841 then 9812312 ");
  });

  test(`returns 'begin' with body`, async () => {
    const rubyFileText = await fse.readFile(
      "src/test/suite/plugins/select_block/ruby_file.rb",
      "utf-8"
    );
    const currentCursorPosition = new vscode.Position(57, 0);

    const result = new RubyFileAnalyzer().getBlockUnderCursorPosition(rubyFileText, currentCursorPosition);

    assert.equal(result?.indentationLength, 8, "Indentation");
    assert.deepEqual(result?.blockOpening, {
      endCharacterPosition: 13,
      line: 57,
      startCharacterPosition: 8,
      text: "begin",
    });
    assert.equal(result?.body.length, 1, "Body length");
    assert.equal(result?.body[0], "          3333");
  });
});