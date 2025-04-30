import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '../layout';

jest.mock('next/font/google', () => ({
  Geist: jest.fn(() => ({
    variable: 'mocked-geist-sans',
  })),
  Geist_Mono: jest.fn(() => ({
    variable: 'mocked-geist-mono',
  })),
}));

describe('RootLayout', () => {
  it('should render correctly', () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="test-content">Test Content</div>
      </RootLayout>
    );
    
    const html = container.querySelector('html');
    expect(html).toHaveAttribute('lang', 'en');
    
    const body = container.querySelector('body');
    expect(body).toHaveClass('mocked-geist-sans');
    expect(body).toHaveClass('mocked-geist-mono');
    expect(body).toHaveClass('antialiased');
    expect(body).toHaveClass('bg-background');
    expect(body).toHaveClass('min-h-screen');
    
    const main = container.querySelector('main');
    expect(main).toHaveClass('container');
    expect(main).toHaveClass('mx-auto');
    expect(main).toHaveClass('py-4');
    expect(main).toHaveClass('px-4');
    
    const testContent = container.querySelector('[data-testid="test-content"]');
    expect(testContent).toBeInTheDocument();
    expect(testContent).toHaveTextContent('Test Content');
  });
});
