import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Switch } from '../switch';

describe('Switch Component', () => {
  it('should render correctly', () => {
    const { container } = render(<Switch />);
    const switchElement = container.querySelector('button[role="switch"]');
    
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('type', 'button');
    expect(switchElement).toHaveAttribute('role', 'switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  it('should apply custom className', () => {
    const { container } = render(<Switch className="custom-class" />);
    const switchElement = container.querySelector('button[role="switch"]');
    
    expect(switchElement).toHaveClass('custom-class');
  });

  it('should pass additional props to the button element', () => {
    const { container } = render(<Switch data-testid="test-switch" id="switch-id" />);
    const switchElement = container.querySelector('button[role="switch"]');
    
    expect(switchElement).toHaveAttribute('id', 'switch-id');
    expect(switchElement).toHaveAttribute('data-testid', 'test-switch');
  });

  it('should render with checked state', () => {
    const { container } = render(<Switch checked />);
    const switchElement = container.querySelector('button[role="switch"]');
    
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  it('should render with disabled state', () => {
    const { container } = render(<Switch disabled />);
    const switchElement = container.querySelector('button[role="switch"]');
    
    expect(switchElement).toHaveAttribute('disabled', '');
  });

  it('should render the thumb element', () => {
    const { container } = render(<Switch />);
    const thumbElement = container.querySelector('span[data-state="unchecked"]');
    
    expect(thumbElement).toBeInTheDocument();
  });
});
