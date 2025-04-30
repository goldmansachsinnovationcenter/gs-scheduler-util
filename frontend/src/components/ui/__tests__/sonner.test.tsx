import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Toaster } from '../sonner';

jest.mock('sonner', () => ({
  Toaster: ({ children, ...props }: any) => (
    <div data-testid="sonner-toaster" {...props}>
      {children}
    </div>
  ),
}));

describe('Sonner Toaster Component', () => {
  it('should render Toaster correctly', () => {
    const { getByTestId } = render(<Toaster />);
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toBeInTheDocument();
  });

  it('should apply custom className to Toaster', () => {
    const { getByTestId } = render(<Toaster className="custom-toaster" />);
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toHaveClass('custom-toaster');
  });

  it('should pass props to Toaster', () => {
    const { getByTestId } = render(
      <Toaster 
        position="top-right"
        theme="dark"
        closeButton
        richColors
      />
    );
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toHaveAttribute('position', 'top-right');
    expect(toaster).toHaveAttribute('theme', 'dark');
    expect(toaster).toHaveAttribute('closeButton', 'true');
    expect(toaster).toHaveAttribute('richColors', 'true');
  });

  it('should handle custom duration', () => {
    const { getByTestId } = render(<Toaster duration={5000} />);
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toHaveAttribute('duration', '5000');
  });

  it('should handle custom expand prop', () => {
    const { getByTestId } = render(<Toaster expand />);
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toHaveAttribute('expand', 'true');
  });

  it('should handle custom visibleToasts prop', () => {
    const { getByTestId } = render(<Toaster visibleToasts={3} />);
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toHaveAttribute('visibleToasts', '3');
  });

  it('should handle custom toastOptions prop', () => {
    const toastOptions = {
      duration: 4000,
      className: 'custom-toast',
    };
    
    const { getByTestId } = render(<Toaster toastOptions={toastOptions} />);
    
    const toaster = getByTestId('sonner-toaster');
    expect(toaster).toHaveAttribute('toastOptions', JSON.stringify(toastOptions));
  });
});
