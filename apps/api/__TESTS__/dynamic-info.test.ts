import { expect } from 'chai';
import { mapToStorageOutput } from '../src/dynamic-info';
import { TEST_CASE_1, TEST_CASE_2 } from './test-cases';

const toStorageInp = (inp: { layout: any; blocks: any; sizes: any }) =>
  [inp.layout, inp.blocks, inp.sizes] as const;

describe('Dynamic Info', () => {
  describe('Storage', () => {
    it('Test Case 1', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_1));
      expect(output).to.deep.equal(TEST_CASE_1.output);
    });
    it('Test Case 2', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_2));
      expect(output).to.deep.equal(TEST_CASE_2.output);
    });
  });
});
