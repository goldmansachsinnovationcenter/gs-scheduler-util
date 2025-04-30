import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Backdrop, LoadingBackdrop } from '../backdrop';

describe('Backdrop Component', () => {
  it('should render children when isOpen is true', () => {
    render(
      <Backdrop isOpen={true}>
        <div data-testid="test-child">Test Content</div>
      </Backdrop>
    );
    
    const child = screen.getByTestId('test-child');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Test Content');
  });

  it('should not render anything when isOpen is false', () => {
    const { container } = render(
      <Backdrop isOpen={false}>
        <div data-testid="test-child">Test Content</div>
      </Backdrop>
    );
    
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId('test-child')).not.toBeInTheDocument();
  });

  it('should apply custom className when provided', () => {
    render(
      <Backdrop isOpen={true} className="custom-class">
        <div>Test Content</div>
      </Backdrop>
    );
    
    const backdrop = screen.getByText('Test Content').parentElement;
    expect(backdrop).toHaveClass('custom-class');
  });

  it('should have default styling', () => {
    render(
      <Backdrop isOpen={true}>
        <div>Test Content</div>
      </Backdrop>
    );
    
    const backdrop = screen.getByText('Test Content').parentElement;
    expect(backdrop).toHaveClass('fixed');
    expect(backdrop).toHaveClass('inset-0');
    expect(backdrop).toHaveClass('bg-background/80');
    expect(backdrop).toHaveClass('backdrop-blur-sm');
    expect(backdrop).toHaveClass('z-50');
    expect(backdrop).toHaveClass('flex');
    expect(backdrop).toHaveClass('items-center');
    expect(backdrop).toHaveClass('justify-center');
  });
});

describe('LoadingBackdrop Component', () => {
  it('should render loading spinner and text when isOpen is true', () => {
    render(<LoadingBackdrop isOpen={true} />);
    
    const loadingText = screen.getByText('Processing...');
    expect(loadingText).toBeInTheDocument();
    
    const spinner = loadingText.parentElement?.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should not render anything when isOpen is false', () => {
    const { container } = render(<LoadingBackdrop isOpen={false} />);
    
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
  });

  it('should have proper loading spinner styling', () => {
    render(<LoadingBackdrop isOpen={true} />);
    
    const spinner = screen.getByText('Processing...').parentElement?.querySelector('.animate-spin');
    expect(spinner).toHaveClass('h-8');
    expect(spinner).toHaveClass('w-8');
    expect(spinner).toHaveClass('rounded-full');
    expect(spinner).toHaveClass('border-4');
    expect(spinner).toHaveClass('border-primary');
    expect(spinner).toHaveClass('border-t-transparent');
  });

  it('should have proper text styling', () => {
    render(<LoadingBackdrop isOpen={true} />);
    
    const text = screen.getByText('Processing...');
    expect(text).toHaveClass('text-sm');
    expect(text).toHaveClass('text-muted-foreground');
  });

  it('should have proper container styling', () => {
    render(<LoadingBackdrop isOpen={true} />);
    
    const container = screen.getByText('Processing...').parentElement;
    expect(container).toHaveClass('flex');
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('items-center');
    expect(container).toHaveClass('gap-2');
  });
});
