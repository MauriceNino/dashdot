import { expect } from 'chai';
import { mapToStorageLayout } from '../src/static-info';
import { TEST_CASE_1 } from './test-cases';

describe('Static Info', () => {
  describe('Storage', () => {
    it('Test Case 1', () => {
      const output = mapToStorageLayout(
        TEST_CASE_1.disks,
        //@ts-ignore
        TEST_CASE_1.blocks,
        TEST_CASE_1.sizes
      );

      expect(output).to.deep.equal(TEST_CASE_1.layout);
    });
  });
});
