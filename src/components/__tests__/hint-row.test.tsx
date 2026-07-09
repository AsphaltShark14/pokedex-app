import { render, screen } from '@testing-library/react-native';
import { describe, expect, it } from '@jest/globals';

import { HintRow } from '@/components/hint-row';

describe('HintRow', () => {
  it('renders the title and hint text', () => {
    render(<HintRow title="Try editing" hint="src/app/index.tsx" />);

    expect(screen.getByText('Try editing')).toBeTruthy();
    expect(screen.getByText('src/app/index.tsx')).toBeTruthy();
  });
});
