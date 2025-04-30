import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toaster } from '../sonner';

jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn() }),
}));

jest.mock('sonner', () => ({
  Toaster: ({ children, ...props }: any) => (
    <div data-testid="sonner-toaster" {...props}>
      {children}
    </div>
  ),
}));

describe('Sonner Toaster Additional Tests', () => {
  it('should use theme from useTheme hook', () => {
    const { getByTestId } = render(<Toaster />);
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toHaveAttribute('theme', 'light');
  });

  it('should apply toastOptions correctly', () => {
    const { getByTestId } = render(
      <Toaster 
        toastOptions={{
          duration: 5000,
          className: 'custom-toast',
        }}
      />
    );
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toHaveAttribute('toastOptions');
    
    const toastOptionsAttr = toaster.getAttribute('toastOptions');
    expect(toastOptionsAttr).toContain('duration');
    expect(toastOptionsAttr).toContain('5000');
    expect(toastOptionsAttr).toContain('custom-toast');
  });

  it('should handle position prop', () => {
    const { getByTestId } = render(<Toaster position="bottom-left" />);
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toHaveAttribute('position', 'bottom-left');
  });

  it('should handle hotkey prop', () => {
    const { getByTestId } = render(<Toaster hotkey={['Control', 'Alt', 't']} />);
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toHaveAttribute('hotkey', JSON.stringify(['Control', 'Alt', 't']));
  });

  it('should handle multiple props simultaneously', () => {
    const { getByTestId } = render(
      <Toaster 
        position="top-center"
        theme="dark"
        richColors
        expand
        closeButton
        offset="10px"
      />
    );
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toHaveAttribute('position', 'top-center');
    expect(toaster).toHaveAttribute('theme', 'dark');
    expect(toaster).toHaveAttribute('richColors', 'true');
    expect(toaster).toHaveAttribute('expand', 'true');
    expect(toaster).toHaveAttribute('closeButton', 'true');
    expect(toaster).toHaveAttribute('offset', '10px');
  });
});
