import { expect } from 'chai';
import { CONFIG } from '../src/config';
import { DynamicStorageMapper } from '../src/data/storage/dynamic';
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
  TEST_CASE_19,
  TEST_CASE_2,
  TEST_CASE_3,
  TEST_CASE_4,
  TEST_CASE_5,
  TEST_CASE_6,
  TEST_CASE_7,
  TEST_CASE_8,
} from './test-cases';

const toStorageInp = (inp: TestCase) =>
  [inp.layout, inp.blocks, inp.sizes] as const;

describe('Dynamic Info', () => {
  beforeEach(() => {
    CONFIG.running_in_docker = true;
  });

  describe('Storage', () => {
    it('Test Case 1', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_1)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_1.output);
    });
    it('Test Case 2', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_2)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_2.output);
    });
    it('Test Case 3', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_3)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_3.output);
    });
    it('Test Case 4', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_4)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_4.output);
    });
    it('Test Case 5', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_5)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_5.output);
    });
    it('Test Case 6', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_6)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_6.output);
    });
    it('Test Case 7', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_7)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_7.output);
    });
    it('Test Case 8', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_8)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_8.output);
    });
    it('Test Case 10', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_10)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_10.output);
    });
    it('Test Case 11', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_11)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_11.output);
    });
    it('Test Case 12', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_12)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_12.output);
    });
    it('Test Case 14', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_14)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_14.output);
    });
    it('Test Case 15', () => {
      CONFIG.running_in_docker = false;
      const output = new DynamicStorageMapper(
        true,
        ...toStorageInp(TEST_CASE_15)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_15.output);
    });
    it('Test Case 16', () => {
      CONFIG.running_in_docker = false;
      const output = new DynamicStorageMapper(
        true,
        ...toStorageInp(TEST_CASE_16)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_16.output);
    });
    it('Test Case 17', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_17)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_17.output);
    });
    it('Test Case 18', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_18)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_18.output);
    });
    it('Test Case 19', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_19)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_19.output);
    });
  });
});
