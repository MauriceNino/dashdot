import { expect } from 'chai';
import { CONFIG } from '../src/config';
import { DynamicStorageMapper } from '../src/data/storage/dynamic';
import {
  TEST_CASE_14,
  TEST_CASE_15,
  TEST_CASE_16,
  TEST_CASE_17,
  TEST_CASE_18,
  TEST_CASE_19,
  TEST_CASE_20,
  TEST_CASE_21,
  TEST_CASE_22,
  TEST_CASE_23,
  TEST_CASE_24,
  TestCase,
} from './test-cases';

const toStorageInp = (inp: TestCase) =>
  [inp.layout, inp.blocks, inp.sizes] as const;

describe('Dynamic Info', () => {
  beforeEach(() => {
    CONFIG.running_in_docker = true;
    CONFIG.fs_device_filter = [];
  });

  describe('Storage', () => {
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
      CONFIG.fs_device_filter = ['sda'];
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_19)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_19.output);
    });
    it('Test Case 20', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_20)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_20.output);
    });
    it('Test Case 21', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_21)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_21.output);
    });
    it('Test Case 22', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_22)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_22.output);
    });
    it('Test Case 23', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_23)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_23.output);
    });
    it('Test Case 24', () => {
      const output = new DynamicStorageMapper(
        false,
        ...toStorageInp(TEST_CASE_24)
      ).getMappedLayout();
      expect(output).to.deep.equal(TEST_CASE_24.output);
    });
  });
});
