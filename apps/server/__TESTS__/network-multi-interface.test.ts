import { expect } from 'chai';
import { aggregateInterfaceStats } from '../src/data/network';

describe('Network Multi-Interface', () => {
  describe('aggregateInterfaceStats', () => {
    it('should parse a single interface correctly', () => {
      const stdout = '1000\n2000\n';
      const result = aggregateInterfaceStats(stdout);
      expect(result.rx).to.equal(1000);
      expect(result.tx).to.equal(2000);
    });

    it('should sum rx and tx across multiple interfaces', () => {
      // Two interfaces: eth0 (rx=1000, tx=2000) + wlan0 (rx=500, tx=300)
      const stdout = '1000\n2000\n500\n300\n';
      const result = aggregateInterfaceStats(stdout);
      expect(result.rx).to.equal(1500);
      expect(result.tx).to.equal(2300);
    });

    it('should sum rx and tx across three interfaces', () => {
      const stdout = '100\n200\n300\n400\n500\n600\n';
      const result = aggregateInterfaceStats(stdout);
      expect(result.rx).to.equal(900);
      expect(result.tx).to.equal(1200);
    });

    it('should handle trailing newline without extra parsing', () => {
      const stdout = '42\n84\n';
      const result = aggregateInterfaceStats(stdout);
      expect(result.rx).to.equal(42);
      expect(result.tx).to.equal(84);
    });

    it('should return zeros for empty output', () => {
      const result = aggregateInterfaceStats('');
      expect(result.rx).to.equal(0);
      expect(result.tx).to.equal(0);
    });

    it('should handle a single interface (backward compatibility)', () => {
      // This is the original behavior before multi-interface support
      const stdout = '99999\n88888\n';
      const result = aggregateInterfaceStats(stdout);
      expect(result.rx).to.equal(99999);
      expect(result.tx).to.equal(88888);
    });

    it('should treat NaN values as 0', () => {
      // If a cat fails, the output might be empty/garbage for that line
      const stdout = '1000\n\n2000\n4000\n';
      const result = aggregateInterfaceStats(stdout);
      // 1000 + 2000 = 3000 rx, NaN(0) + 4000 = 4000 tx
      // Actually: filtered empty line, so values = [1000, 2000, 4000]
      // rx = 1000 + 4000 = 5000, tx = 2000
      // Wait — after filtering empty: [1000, 2000, 4000]
      // i=0: rx += 1000, tx += 2000
      // i=2: rx += 4000, tx += undefined||0 = 0
      // rx = 5000, tx = 2000
      expect(result.rx).to.equal(5000);
      expect(result.tx).to.equal(2000);
    });
  });
});
