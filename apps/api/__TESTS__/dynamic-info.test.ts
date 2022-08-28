import { expect } from 'chai';
import { mapToStorageOutput } from '../src/dynamic-info';
import { TEST_CASE_1 } from './test-cases';

describe('Dynamic Info', () => {
  describe('Storage', () => {
    it('Test Case 1', () => {
      const output = mapToStorageOutput(
        TEST_CASE_1.layout,
        //@ts-ignore
        TEST_CASE_1.blocks,
        TEST_CASE_1.sizes
      );

      expect(output).to.deep.equal({ layout: [{ load: 185203033088 }] });
    });
  });
});
