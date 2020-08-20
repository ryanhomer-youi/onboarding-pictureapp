import { fillArray, formatMsToHMS } from '../helpers';

describe('fillArray', () => {
  it('adds the correct number of blank entries', () => {
    expect(fillArray([{}, {}], 4)).toEqual([{}, {}, {}, {}]);
  });
  it("doesn't add when not needed", () => {
    expect(fillArray([{}, {}, {}, {}], 4)).toEqual([{}, {}, {}, {}]);
  });
});

describe('formatMsToHMS', () => {
  it('converts correctly when no zero padding is needed', () => {
    expect(formatMsToHMS(10*36e5 + 10*6e4 + 10*1e3)).toBe('10:10:10');
  });
  it('pads h, m, s with zeros', () => {
    expect(formatMsToHMS(9*36e5 + 9*6e4 + 9*1e3)).toBe('09:09:09');
  });
});
