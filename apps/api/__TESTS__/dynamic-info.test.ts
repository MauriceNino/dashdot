import { expect } from 'chai';
import { mapToStorageOutput } from '../src/dynamic-info';
import {
  TestCase,
  TEST_CASE_1,
  TEST_CASE_10,
  TEST_CASE_11,
  TEST_CASE_12,
  TEST_CASE_13,
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
    it('Test Case 3', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_3));
      expect(output).to.deep.equal(TEST_CASE_3.output);
    });
    it('Test Case 4', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_4));
      expect(output).to.deep.equal(TEST_CASE_4.output);
    });
    it('Test Case 5', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_5));
      expect(output).to.deep.equal(TEST_CASE_5.output);
    });
    it('Test Case 6', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_6));
      expect(output).to.deep.equal(TEST_CASE_6.output);
    });
    it('Test Case 7', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_7));
      expect(output).to.deep.equal(TEST_CASE_7.output);
    });
    it('Test Case 8', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_8));
      expect(output).to.deep.equal(TEST_CASE_8.output);
    });
    it('Test Case 9', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_9));
      expect(output).to.deep.equal(TEST_CASE_9.output);
    });
    it('Test Case 10', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_10));
      expect(output).to.deep.equal(TEST_CASE_10.output);
    });
    it('Test Case 11', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_11));
      expect(output).to.deep.equal(TEST_CASE_11.output);
    });
    it('Test Case 12', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_12));
      expect(output).to.deep.equal(TEST_CASE_12.output);
    });
    it('Test Case 13', () => {
      const output = mapToStorageOutput(...toStorageInp(TEST_CASE_13));
      expect(output).to.deep.equal(TEST_CASE_13.output);
    });
  });
});
