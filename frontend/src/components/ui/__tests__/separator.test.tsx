import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Separator } from '../separator';

describe('Separator Component', () => {
  it('should render correctly with default props', () => {
    const { container } = render(<Separator />);
    const separator = container.querySelector('[data-slot="separator"]');
    
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('shrink-0 bg-border');
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('should apply custom className', () => {
    const { container } = render(<Separator className="custom-class" />);
    const separator = container.querySelector('[data-slot="separator"]');
    
    expect(separator).toHaveClass('custom-class');
  });

  it('should render with vertical orientation', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.querySelector('[data-slot="separator"]');
    
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
    expect(separator).toHaveClass('h-full w-[1px]');
  });

  it('should render with horizontal orientation', () => {
    const { container } = render(<Separator orientation="horizontal" />);
    const separator = container.querySelector('[data-slot="separator"]');
    
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    expect(separator).toHaveClass('h-[1px] w-full');
  });

  it('should pass additional props to the separator element', () => {
    const { container } = render(
      <Separator 
        data-testid="test-separator" 
        id="separator-id"
        aria-label="Separator"
      />
    );
    const separator = container.querySelector('[data-slot="separator"]');
    
    expect(separator).toHaveAttribute('id', 'separator-id');
    expect(separator).toHaveAttribute('data-testid', 'test-separator');
    expect(separator).toHaveAttribute('aria-label', 'Separator');
  });

  it('should render with decorative role by default', () => {
    const { container } = render(<Separator />);
    const separator = container.querySelector('[data-slot="separator"]');
    
    expect(separator).toHaveAttribute('role', 'separator');
  });
});
