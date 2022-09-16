import { expect } from 'chai';
import { mapToStorageLayout } from '../src/static-info';
import {
  TestCase,
  TEST_CASE_1,
  TEST_CASE_10,
  TEST_CASE_11,
  TEST_CASE_2,
  TEST_CASE_3,
  TEST_CASE_4,
  TEST_CASE_5,
  TEST_CASE_6,
  TEST_CASE_7,
  TEST_CASE_8,
  TEST_CASE_9,
} from './test-cases';

const toStorageInp = (inp: TestCase) =>
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
    it('Test Case 3', () => {
      const output = mapToStorageLayout(...toStorageInp(TEST_CASE_3));
      expect(output).to.deep.equal(TEST_CASE_3.layout);
    });
    it('Test Case 4', () => {
      const output = mapToStorageLayout(...toStorageInp(TEST_CASE_4));
      expect(output).to.deep.equal(TEST_CASE_4.layout);
    });
    it('Test Case 5', () => {
      const output = mapToStorageLayout(...toStorageInp(TEST_CASE_5));
      expect(output).to.deep.equal(TEST_CASE_5.layout);
    });
    it('Test Case 6', () => {
      const output = mapToStorageLayout(...toStorageInp(TEST_CASE_6));
      expect(output).to.deep.equal(TEST_CASE_6.layout);
    });
    it('Test Case 7', () => {
      const output = mapToStorageLayout(...toStorageInp(TEST_CASE_7));
      expect(output).to.deep.equal(TEST_CASE_7.layout);
    });
    it('Test Case 8', () => {
      const output = mapToStorageLayout(...toStorageInp(TEST_CASE_8));
      expect(output).to.deep.equal(TEST_CASE_8.layout);
    });
    it('Test Case 9', () => {
      const output = mapToStorageLayout(...toStorageInp(TEST_CASE_9));
      expect(output).to.deep.equal(TEST_CASE_9.layout);
    });
    it('Test Case 10', () => {
      const output = mapToStorageLayout(...toStorageInp(TEST_CASE_10));
      expect(output).to.deep.equal(TEST_CASE_10.layout);
    });
    it('Test Case 11', () => {
      const output = mapToStorageLayout(...toStorageInp(TEST_CASE_11));
      expect(output).to.deep.equal(TEST_CASE_11.layout);
    });
  });
});
