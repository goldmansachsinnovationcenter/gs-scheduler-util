import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Backdrop, LoadingBackdrop } from '../backdrop';

describe('Backdrop Component', () => {
  it('renders correctly when isOpen is true', () => {
    render(
      <Backdrop isOpen={true} data-testid="backdrop">
        Test content
      </Backdrop>
    );
    
    const backdrop = screen.getByText('Test content');
    expect(backdrop).toBeInTheDocument();
  });
  
  it('does not render when isOpen is false', () => {
    render(
      <Backdrop isOpen={false} data-testid="backdrop">
        Test content
      </Backdrop>
    );
    
    const backdrop = screen.queryByText('Test content');
    expect(backdrop).not.toBeInTheDocument();
  });
  
  it('applies custom className when provided', () => {
    render(
      <Backdrop isOpen={true} className="custom-class" data-testid="backdrop">
        Test content
      </Backdrop>
    );
    
    const backdrop = screen.getByText('Test content').parentElement;
    expect(backdrop).toHaveAttribute('class', expect.stringContaining('custom-class'));
  });
});

describe('LoadingBackdrop Component', () => {
  it('renders correctly when isOpen is true', () => {
    render(<LoadingBackdrop isOpen={true} />);
    
    const processingText = screen.getByText('Processing...');
    expect(processingText).toBeInTheDocument();
  });
  
  it('does not render when isOpen is false', () => {
    render(<LoadingBackdrop isOpen={false} />);
    
    const processingText = screen.queryByText('Processing...');
    expect(processingText).not.toBeInTheDocument();
  });
  
  it('renders a spinner when isOpen is true', () => {
    render(<LoadingBackdrop isOpen={true} />);
    
    const spinner = screen.getByText('Processing...').previousSibling;
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
  });
});
