import * as assert from 'assert'
import {
  foldAllDescribes,
  foldAllContexts,
  foldAllIts,
} from '../../../../plugins/fold_all'

suite('#foldAllDescribes', () => {
  test('returns array of lines number which starts with the world \'describe\'', () => {
    const text = `// this is the line 0 //
      require 'rails_helper'

      RSpec.describe DummyClass do
        describe '#foo' do
          context "when 'bar'" do
            it "returns 'baz'" do
            end

            it "returns 'qaz'" do
            end
          end
        end

        describe '#fizz' do
          context "when 'qiz'" do
            it "returns 'ezz'" do
            end
          end
        end
      end
    `

    const result = foldAllDescribes(text)

    assert.deepEqual(result, [4, 14])
  })

  test('returns array of lines number which starts with the world \'context\'', () => {
    const text = `// this is the line 0 //
      require 'rails_helper'

      RSpec.describe DummyClass do
        describe '#foo' do
          context "when 'bar'" do
            it "returns 'baz'" do
            end

            it "returns 'qaz'" do
            end
          end
        end

        describe '#fizz' do
          context "when 'qiz'" do
            it "returns 'ezz'" do
            end
          end
        end
      end
    `

    const result = foldAllContexts(text)

    assert.deepEqual(result, [5, 15])
  })

  test('returns array of lines number which starts with the world \'it\'', () => {
    const text = `// this is the line 0 //
      require 'rails_helper'

      RSpec.describe DummyClass do
        describe '#foo' do
          context "when 'bar'" do
            it "returns 'baz'" do
            end

            it "returns 'qaz'" do
            end
          end
        end

        describe '#fizz' do
          context "when 'qiz'" do
            it "returns 'ezz'" do
            end
          end
        end
      end
    `

    const result = foldAllIts(text)

    assert.deepEqual(result, [6, 9, 16])
  })
})
