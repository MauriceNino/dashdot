import { expect } from 'chai';
import { CONFIG } from '../src/config';
import { mapToStorageLayout } from '../src/data/storage/static';
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
  TestCase,
} from './test-cases';

const toStorageInp = (inp: TestCase) =>
  [inp.disks, inp.blocks, inp.sizes] as const;

describe('Static Info', () => {
  beforeEach(() => {
    CONFIG.running_in_docker = true;
    CONFIG.fs_device_filter = [];
  });

  describe('Storage', () => {
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
    it('Test Case 19', () => {
      CONFIG.fs_device_filter = ['sda'];
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_19));
      expect(output).to.deep.equal(TEST_CASE_19.layout);
    });
    it('Test Case 20', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_20));
      expect(output).to.deep.equal(TEST_CASE_20.layout);
    });
    it('Test Case 21', () => {
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_21));
      expect(output).to.deep.equal(TEST_CASE_21.layout);
    });
    it('Test Case 22', () => {
      CONFIG.fs_device_filter = ['sda', 'sdb', 'sdd'];
      const output = mapToStorageLayout(false, ...toStorageInp(TEST_CASE_22));
      expect(output).to.deep.equal(TEST_CASE_22.layout);
    });
  });
});
