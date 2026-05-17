import { expect } from 'chai';
import { mergeNetworkInterfaceInfo } from '../src/data/network';
import { parseNetworkInterfaces } from '../src/setup';

describe('Network', () => {
  describe('parseNetworkInterfaces', () => {
    it('parses comma-separated and newline-separated interface names', () => {
      expect(parseNetworkInterfaces('eth0, wlan0\nbr0')).to.deep.equal([
        'eth0',
        'wlan0',
        'br0',
      ]);
    });

    it('ignores empty interface names', () => {
      expect(parseNetworkInterfaces('eth0,, \n wlan0')).to.deep.equal([
        'eth0',
        'wlan0',
      ]);
    });
  });

  describe('mergeNetworkInterfaceInfo', () => {
    it('lists multiple selected interfaces in the type label', () => {
      expect(
        mergeNetworkInterfaceInfo([
          { name: 'eth0', type: 'Wired', interfaceSpeed: 1000 },
          { name: 'wlan0', type: 'Wireless' },
        ]),
      ).to.deep.equal({
        type: 'eth0 (Wired), wlan0 (Wireless)',
        interfaceSpeed: 1000,
      });
    });

    it('aggregates interface speeds when more than one interface reports speed', () => {
      expect(
        mergeNetworkInterfaceInfo([
          { name: 'eth0', type: 'Wired', interfaceSpeed: 1000 },
          { name: 'bond0', type: 'Bond', interfaceSpeed: 10000 },
        ]),
      ).to.deep.equal({
        type: 'eth0 (Wired), bond0 (Bond)',
        interfaceSpeed: 11000,
      });
    });
  });
});
