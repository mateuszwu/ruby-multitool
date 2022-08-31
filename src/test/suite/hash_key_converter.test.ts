import * as assert from "assert";
import { HashKeyConverter } from "../../hash_key_converter";

suite("#convertSingleKey", () => {
  [
    { actualValue: "{ :foo => 'value', }", expectedValue: "{ foo: 'value', }", cursorAtWord: 'foo' },
    { actualValue: "{ :\"foo\" => value }", expectedValue: "{ foo: value }", cursorAtWord: 'foo' },
    { actualValue: "{ :'foo' => value }", expectedValue: "{ foo: value }", cursorAtWord: 'foo' },
    { actualValue: "{ 'foo'=> value }", expectedValue: "{ foo: value }", cursorAtWord: 'foo' },
    { actualValue: "{ \"foo\"=> value }", expectedValue: "{ foo: value }", cursorAtWord: 'foo' },
    { actualValue: "{ :'foo_#{1}' => value }", expectedValue: "{ 'foo_#{1}': value }", cursorAtWord: 'foo' },
    { actualValue: "{ :'foo 1' => value }", expectedValue: "{ 'foo 1': value }", cursorAtWord: 'foo' },
    { actualValue: "{ foo: value }", expectedValue: "{ 'foo' => value }", cursorAtWord: 'foo'},
    { actualValue: "{ 'foo': 'value', }", expectedValue: "{ 'foo' => 'value', }", cursorAtWord: 'foo' },
    { actualValue: '{ :"foo_#{1}" => value }', expectedValue: '{ "foo_#{1}": value }', cursorAtWord: 'foo' },
    { actualValue: "{ :foo => 'v', :baz => 'f', :bar => 'g' }", expectedValue: "{ :foo => 'v', baz: 'f', :bar => 'g' }", cursorAtWord: 'baz' },
    {
      actualValue: "{ foo => 1, bar: 2, :baz => 3, 'biz' => 4, :'buf' => 5 }",
      expectedValue: "{ foo => 1, bar: 2, :baz => 3, 'biz' => 4, :'buf' => 5 }",
      cursorAtWord: 'foo'
    },
    {
      actualValue: "{ foo => 1, bar: 2, :baz => 3, 'biz' => 4, :'buf' => 5 }",
      expectedValue: "{ foo => 1, 'bar' => 2, :baz => 3, 'biz' => 4, :'buf' => 5 }",
      cursorAtWord: 'bar'
    },
    {
      actualValue: "{ foo => 1, bar: 2, :baz => 3, 'biz' => 4, :'buf' => 5 }",
      expectedValue: "{ foo => 1, bar: 2, baz: 3, 'biz' => 4, :'buf' => 5 }",
      cursorAtWord: 'baz'
    },
    {
      actualValue: "{ foo => 1, bar: 2, :baz => 3, 'biz' => 4, :'buf' => 5 }",
      expectedValue: "{ foo => 1, bar: 2, :baz => 3, biz: 4, :'buf' => 5 }",
      cursorAtWord: 'biz'
    },
    {
      actualValue: "{ foo => 1, bar: 2, :baz => 3, 'biz' => 4, :'buf' => 5 }",
      expectedValue: "{ foo => 1, bar: 2, :baz => 3, 'biz' => 4, buf: 5 }",
      cursorAtWord: 'buf'
    }
  ].forEach(({ actualValue, expectedValue, cursorAtWord }) => {
    test(`selected word: ${cursorAtWord} - convert ${actualValue} to key: ${expectedValue}`, () => {
      let characterNumber = actualValue.indexOf(cursorAtWord);

      let result = new HashKeyConverter().convertSingleKey(actualValue, characterNumber);

      assert(result === expectedValue, `${result} === ${expectedValue}`);
    });
  });

  [
    { actualValue: '{ foo => value }' },
    { actualValue: '{ foo[0] => value }' },
  ].forEach(({ actualValue }) => {
    test(`DO NOT convert ${actualValue}`, () => {
      let characterNumber = 4;

      let result = new HashKeyConverter().convertSingleKey(actualValue, characterNumber);

      assert(result === actualValue, `${result} === ${actualValue}`);
    });
  });
});

suite("#convertAllKeys", () => {
  [
    {
      actualValue: "{ 'foo' => value, 'baz' => value }",
      expectedValue: "{ foo: value, baz: value }",
    },
    {
      actualValue: `{
        'foo' => value,
        baz: value, bar => value,
        :'biz' => value
      }`,
      expectedValue: `{
        foo: value,
        baz: value, bar => value,
        biz: value
      }`,
    },
    {
      actualValue: `{
        foo: value,
        baz: value, bar => value,
        biz: value
      }`,
      expectedValue: `{
        'foo' => value,
        'baz' => value, bar => value,
        'biz' => value
      }`,
    },
  ].forEach(({ actualValue, expectedValue }) => {
    test(`convert ${actualValue} to: ${expectedValue}`, () => {
      let result = new HashKeyConverter().convertAllKeys(actualValue);

      assert(result === expectedValue, `${result} === ${expectedValue}`);
    });
  });
});
