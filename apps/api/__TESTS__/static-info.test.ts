import { expect } from 'chai';
import { mapToStorageLayout } from '../src/static-info';
import { TEST_CASE_1, TEST_CASE_2 } from './test-cases';

const toStorageInp = (inp: { disks: any; blocks: any; sizes: any }) =>
  [inp.disks, inp.blocks, inp.sizes] as const;

describe('Static Info', () => {
  describe('Storage', () => {
    it('Test Case 1', () => {
      const output = mapToStorageLayout(...toStorageInp(TEST_CASE_1));
      expect(output).to.deep.equal(TEST_CASE_1.layout);
    });
    it('Test Case 2', () => {
      const output = mapToStorageLayout(...toStorageInp(TEST_CASE_2));
      expect(output).to.deep.equal(TEST_CASE_2.layout);
    });
  });
});
