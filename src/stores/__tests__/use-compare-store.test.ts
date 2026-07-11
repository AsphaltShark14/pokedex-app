import { beforeEach, describe, expect, it } from '@jest/globals';

import { useCompareStore } from '@/stores/use-compare-store';

describe('useCompareStore', () => {
  beforeEach(() => {
    useCompareStore.setState({ compareIds: [] });
  });

  it('adds a Pokemon to the compare set', () => {
    useCompareStore.getState().toggleCompare(1);
    expect(useCompareStore.getState().compareIds).toEqual([1]);
  });

  it('removes a Pokemon already in the compare set', () => {
    useCompareStore.setState({ compareIds: [1, 2] });
    useCompareStore.getState().toggleCompare(1);
    expect(useCompareStore.getState().compareIds).toEqual([2]);
  });

  it('replaces the oldest entry when a 3rd Pokemon is toggled on', () => {
    useCompareStore.getState().toggleCompare(1);
    useCompareStore.getState().toggleCompare(2);
    useCompareStore.getState().toggleCompare(3);
    expect(useCompareStore.getState().compareIds).toEqual([2, 3]);
  });

  it('clears the compare set', () => {
    useCompareStore.setState({ compareIds: [1, 2] });
    useCompareStore.getState().clearCompare();
    expect(useCompareStore.getState().compareIds).toEqual([]);
  });
});
