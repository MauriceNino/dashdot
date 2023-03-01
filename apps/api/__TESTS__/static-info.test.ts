import { expect } from 'chai';
import { CONFIG } from '../src/config';
import { mapToStorageLayout } from '../src/data/storage/static';
import {
  TestCase,
  TEST_CASE_1,
  TEST_CASE_10,
  TEST_CASE_11,
  TEST_CASE_12,
  TEST_CASE_14,
  TEST_CASE_15,
  TEST_CASE_16,
  TEST_CASE_17,
  TEST_CASE_18,
  TEST_CASE_2,
  TEST_CASE_3,
  TEST_CASE_4,
  TEST_CASE_5,
  TEST_CASE_6,
  TEST_CASE_7,
  TEST_CASE_8,
} from './test-cases';

const toStorageInp = (inp: TestCase) =>
  [inp.disks, inp.blocks, inp.sizes] as const;

describe('Static Info', () => {
  beforeEach(() => {
    CONFIG.running_in_docker = true;
  });

  describe('Storage', () => {
    it('Test Case 1', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_1));
      expect(output).to.deep.equal(TEST_CASE_1.layout);
    });
    it('Test Case 2', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_2));
      expect(output).to.deep.equal(TEST_CASE_2.layout);
    });
    it('Test Case 3', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_3));
      expect(output).to.deep.equal(TEST_CASE_3.layout);
    });
    it('Test Case 4', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_4));
      expect(output).to.deep.equal(TEST_CASE_4.layout);
    });
    it('Test Case 5', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_5));
      expect(output).to.deep.equal(TEST_CASE_5.layout);
    });
    it('Test Case 6', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_6));
      expect(output).to.deep.equal(TEST_CASE_6.layout);
    });
    it('Test Case 7', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_7));
      expect(output).to.deep.equal(TEST_CASE_7.layout);
    });
    it('Test Case 8', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_8));
      expect(output).to.deep.equal(TEST_CASE_8.layout);
    });
    it('Test Case 10', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_10));
      expect(output).to.deep.equal(TEST_CASE_10.layout);
    });
    it('Test Case 11', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_11));
      expect(output).to.deep.equal(TEST_CASE_11.layout);
    });
    it('Test Case 12', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_12));
      expect(output).to.deep.equal(TEST_CASE_12.layout);
    });
    it('Test Case 14', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_14));
      expect(output).to.deep.equal(TEST_CASE_14.layout);
    });
    it('Test Case 15', () => {
      CONFIG.running_in_docker = false;
      const output = mapToStorageLayout(true, ...toStorageInp(TEST_CASE_15));
      expect(output).to.deep.equal(TEST_CASE_15.layout);
    });
    it('Test Case 16', () => {
      CONFIG.running_in_docker = false;
      const output = mapToStorageLayout(true, ...toStorageInp(TEST_CASE_16));
      expect(output).to.deep.equal(TEST_CASE_16.layout);
    });
    it('Test Case 17', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_17));
      expect(output).to.deep.equal(TEST_CASE_17.layout);
    });
    it('Test Case 18', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_18));
      expect(output).to.deep.equal(TEST_CASE_18.layout);
    });
  });
});
